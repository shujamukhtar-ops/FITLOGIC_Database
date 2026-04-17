export interface UserProfile {
  id: string;
  name: string;
  height: number; // in cm
  weight: number; // in kg
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description: string;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  perceivedExertion: number; // 1-10 scale
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  maxVolume: number; // total weight lifted (sets * reps * weight)
  estimatedOneRepMax: number; // Calculated using Brzycki formula
  date: string;
}