-- Database Schema for FitTracker
-- Designed to be strictly in BCNF/3NF.

CREATE TABLE Users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    height DECIMAL(5,2) CHECK (height > 0),
    weight DECIMAL(5,2) CHECK (weight > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Exercises (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    muscle_group VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE Workouts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE WorkoutExercises (
    id UUID PRIMARY KEY,
    workout_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES Workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercises(id)
);

CREATE TABLE WorkoutSets (
    id UUID PRIMARY KEY,
    workout_exercise_id UUID NOT NULL,
    set_number INT NOT NULL CHECK (set_number > 0),
    reps INT NOT NULL CHECK (reps >= 0),
    weight DECIMAL(6,2) NOT NULL CHECK (weight >= 0),
    perceived_exertion INT CHECK (perceived_exertion BETWEEN 1 AND 10),
    FOREIGN KEY (workout_exercise_id) REFERENCES WorkoutExercises(id) ON DELETE CASCADE,
    UNIQUE(workout_exercise_id, set_number)
);

-- 1. Generated Column for Brzycki 1RM Formula
ALTER TABLE WorkoutSets 
ADD COLUMN estimated_1rm DECIMAL(6,2) GENERATED ALWAYS AS (
    CASE 
        WHEN reps = 1 THEN weight
        WHEN reps >= 37 THEN weight
        ELSE ROUND(weight * (36.0 / (37.0 - reps)), 1)
    END
) STORED;

-- 2. View: Workout Volumes (Calculates per-session stats)
CREATE VIEW WorkoutVolumes AS
SELECT 
    we.id AS workout_exercise_id,
    we.workout_id,
    we.exercise_id,
    SUM(ws.weight * ws.reps) AS total_volume,
    MAX(ws.weight) AS max_weight_lifted,
    MAX(ws.estimated_1rm) AS best_1rm
FROM WorkoutExercises we
JOIN WorkoutSets ws ON we.id = ws.workout_exercise_id
GROUP BY we.id, we.workout_id, we.exercise_id;

-- 3. View: Personal Records (Replaces calculatePersonalRecords from calculations.ts)
CREATE VIEW PersonalRecords AS
SELECT 
    w.user_id,
    e.name AS exercise_name,
    MAX(v.max_weight_lifted) AS all_time_max_weight,
    MAX(v.best_1rm) AS all_time_best_1rm,
    MAX(v.total_volume) AS all_time_max_volume
FROM Workouts w
JOIN WorkoutVolumes v ON w.id = v.workout_id
JOIN Exercises e ON v.exercise_id = e.id
GROUP BY w.user_id, e.name;

-- 4. View: Dashboard Stats (Replaces getWorkoutStats from calculations.ts)
CREATE VIEW DashboardStats AS
SELECT 
    w.user_id,
    COUNT(DISTINCT w.id) AS total_workouts,
    COUNT(DISTINCT we.exercise_id) AS total_unique_exercises,
    SUM(ws.weight * ws.reps) AS total_volume_lifted
FROM Workouts w
LEFT JOIN WorkoutExercises we ON w.id = we.workout_id
LEFT JOIN WorkoutSets ws ON we.id = ws.workout_exercise_id
GROUP BY w.user_id;
