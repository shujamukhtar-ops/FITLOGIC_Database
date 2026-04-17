import type { Workout } from "../types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ExerciseSet = {
  weight?: number | null;
  reps?: number | null;
  perceivedExertion?: number | null;
};

function getBestOneRepMax(sets: ExerciseSet[]) {
  let best: { oneRM: number; weight: number; reps: number } | null = null;

  for (const set of sets) {
    const weight = set.weight ?? 0;
    const reps = set.reps ?? 0;
    if (weight <= 0 || reps <= 0) continue;

    // Epley formula: 1RM = weight * (1 + reps / 30)
    const oneRM = weight * (1 + reps / 30);

    if (!best || oneRM > best.oneRM) {
      best = { oneRM, weight, reps };
    }
  }

  return best;
}

function calculateTotalVolume(sets: ExerciseSet[]) {
  return sets.reduce((total, set) => {
    const weight = set.weight ?? 0;
    const reps = set.reps ?? 0;
    return total + weight * reps;
  }, 0);
}

interface ExerciseProgressProps {
  exerciseId: string;
  exerciseName: string;
  workouts: Workout[];
}

interface ChartDataPoint {
  date: string;
  fullDate: string;
  maxWeight: number;
  estimatedOneRepMax: number;
  volume: number;
  avgRPE: number;
}

export function ExerciseProgress({ exerciseId, exerciseName, workouts }: ExerciseProgressProps) {
  // Filter workouts that contain this exercise
  const relevantWorkouts = workouts
    .filter(workout => workout.exercises.some(ex => ex.exerciseId === exerciseId))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare data for charts
  const chartData = relevantWorkouts
    .map((workout): ChartDataPoint | null => {
      const exercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
      if (!exercise || exercise.sets.length === 0) return null;

      const maxWeight = Math.max(...exercise.sets.map(set => set.weight ?? 0));
      const best1RM = getBestOneRepMax(exercise.sets);
      const volume = calculateTotalVolume(exercise.sets);
      const avgRPE =
        exercise.sets.reduce((sum, set) => sum + (set.perceivedExertion ?? 0), 0) / exercise.sets.length;

      return {
        date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: workout.date,
        maxWeight,
        estimatedOneRepMax: best1RM?.oneRM || 0,
        volume,
        avgRPE: Math.round(avgRPE * 10) / 10,
      };
    })
    .filter((point): point is ChartDataPoint => point !== null);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for this exercise
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">{exerciseName} Progress</h2>

      {/* Estimated 1RM Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estimated 1RM Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="estimatedOneRepMax" 
              stroke="#9333ea" 
              strokeWidth={2}
              name="Est. 1RM (kg)"
              dot={{ fill: '#9333ea', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Max Weight Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Max Weight Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="maxWeight" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Max Weight (kg)"
              dot={{ fill: '#2563eb', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#16a34a" 
              strokeWidth={2}
              name="Total Volume (kg)"
              dot={{ fill: '#16a34a', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Average RPE */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average RPE (Perceived Exertion)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} label={{ value: 'RPE', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="avgRPE" 
              stroke="#dc2626" 
              strokeWidth={2}
              name="Avg RPE"
              dot={{ fill: '#dc2626', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
