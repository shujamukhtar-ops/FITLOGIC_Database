import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize connection pool to PostgreSQL
const pool = new Pool({
    database: 'fitlogic',
    host: '/var/run/postgresql',
    port: 5432,
});

const PORT = 3000;

// Test connection endpoint
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'healthy', time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to create a User (Profile)
app.post('/api/users', async (req, res) => {
    try {
        const { name, height, weight } = req.body;
        const id = uuidv4();
        await pool.query(
            'INSERT INTO Users (id, name, height, weight) VALUES ($1, $2, $3, $4)',
            [id, name, height, weight]
        );
        res.status(201).json({ message: 'User created successfully', id });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to get all users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to fetch logged workouts
app.get('/api/workouts', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                w.id as workout_id, w.date, w.notes,
                we.id as workout_exercise_id, e.name as exercise_name,
                ws.set_number, ws.weight, ws.reps
            FROM Workouts w
            LEFT JOIN WorkoutExercises we ON w.id = we.workout_id
            LEFT JOIN Exercises e ON we.exercise_id = e.id
            LEFT JOIN WorkoutSets ws ON we.id = ws.workout_exercise_id
            ORDER BY w.date DESC, we.id, ws.set_number;
        `);
        
        // Group the flat SQL result into structured JSON
        const workoutsMap = new Map();
        result.rows.forEach(row => {
            if (!workoutsMap.has(row.workout_id)) {
                workoutsMap.set(row.workout_id, {
                    id: row.workout_id,
                    date: row.date,
                    notes: row.notes,
                    exercises: []
                });
            }
            const workout = workoutsMap.get(row.workout_id);
            
            if (row.workout_exercise_id) {
                let exercise = workout.exercises.find((e: any) => e.id === row.workout_exercise_id);
                if (!exercise) {
                    exercise = {
                        id: row.workout_exercise_id,
                        name: row.exercise_name,
                        sets: []
                    };
                    workout.exercises.push(exercise);
                }
                
                if (row.set_number) {
                    exercise.sets.push({
                        set_number: row.set_number,
                        weight: row.weight,
                        reps: row.reps
                    });
                }
            }
        });
        
        res.json(Array.from(workoutsMap.values()));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to fetch Dashboard Stats view
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT total_workouts, total_unique_exercises, total_volume_lifted FROM DashboardStats LIMIT 1');
        // If no rows, return defaults
        if (result.rows.length === 0) {
            return res.json({ totalWorkouts: 0, totalExercises: 0, totalVolume: 0 });
        }
        const row = result.rows[0];
        res.json({
            totalWorkouts: parseInt(row.total_workouts || '0', 10),
            totalExercises: parseInt(row.total_unique_exercises || '0', 10),
            totalVolume: parseInt(row.total_volume_lifted || '0', 10)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to fetch Personal Records view
app.get('/api/dashboard/prs', async (req, res) => {
    try {
        const result = await pool.query('SELECT exercise_name, all_time_max_weight, all_time_best_1rm, all_time_max_volume FROM PersonalRecords LIMIT 10');
        res.json(result.rows.map(row => ({
            exerciseName: row.exercise_name,
            maxWeight: parseFloat(row.all_time_max_weight || '0'),
            best1rm: parseFloat(row.all_time_best_1rm || '0'),
            maxVolume: parseFloat(row.all_time_max_volume || '0')
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to fetch Exercises library
app.get('/api/exercises', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Exercises ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

// Endpoint to create a Workout
app.post('/api/workouts', async (req, res) => {
    const client = await pool.connect();
    try {
        const { date, exercises, notes } = req.body;
        // User is hardcoded or optional, here we just insert the workout.
        const workoutId = uuidv4();
        
        await client.query('BEGIN');
        
        // Let's assume there is at least a user in the DB.
        // We'll just grab the first user or make one if empty for foreign key satisfaction.
        let userResult = await client.query('SELECT id FROM Users LIMIT 1');
        let userId;
        if (userResult.rows.length === 0) {
            userId = uuidv4();
            await client.query('INSERT INTO Users (id, name, height, weight) VALUES ($1, $2, $3, $4)', [userId, 'Default User', 180, 80]);
        } else {
            userId = userResult.rows[0].id;
        }

        // Use provided date or default to now
        const workoutDate = date || new Date().toISOString();

        // Insert Workout
        await client.query(
            'INSERT INTO Workouts (id, user_id, date, notes) VALUES ($1, $2, $3, $4)',
            [workoutId, userId, workoutDate, notes || '']
        );

        // Insert Exercises and Sets
        for (const ex of (exercises || [])) {
            const workoutExerciseId = uuidv4();
            await client.query(
                'INSERT INTO WorkoutExercises (id, workout_id, exercise_id) VALUES ($1, $2, $3)',
                [workoutExerciseId, workoutId, ex.exerciseId || ex.exercise_id]
            );

            for (const [index, set] of (ex.sets || []).entries()) {
                const setId = uuidv4();
                await client.query(
                    'INSERT INTO WorkoutSets (id, workout_exercise_id, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5)',
                    [setId, workoutExerciseId, index + 1, set.weight || 0, set.reps || 0]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Workout logged successfully', id: workoutId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: String(err) });
    } finally {
        client.release();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
