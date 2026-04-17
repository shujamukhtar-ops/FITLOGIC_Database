import { Exercise } from "../types";

export const exerciseLibrary: Exercise[] = [
  // Chest
  { id: "1", name: "Barbell Bench Press", muscleGroup: "Chest", description: "Classic compound chest exercise" },
  { id: "2", name: "Incline Dumbbell Press", muscleGroup: "Chest", description: "Targets upper chest" },
  { id: "3", name: "Dumbbell Flyes", muscleGroup: "Chest", description: "Isolation exercise for chest" },
  { id: "4", name: "Push-ups", muscleGroup: "Chest", description: "Bodyweight chest exercise" },
  
  // Back
  { id: "5", name: "Deadlift", muscleGroup: "Back", description: "Full body compound exercise" },
  { id: "6", name: "Pull-ups", muscleGroup: "Back", description: "Bodyweight back exercise" },
  { id: "7", name: "Barbell Row", muscleGroup: "Back", description: "Compound back exercise" },
  { id: "8", name: "Lat Pulldown", muscleGroup: "Back", description: "Lat-focused exercise" },
  
  // Legs
  { id: "9", name: "Barbell Squat", muscleGroup: "Legs", description: "King of leg exercises" },
  { id: "10", name: "Leg Press", muscleGroup: "Legs", description: "Machine-based leg exercise" },
  { id: "11", name: "Romanian Deadlift", muscleGroup: "Legs", description: "Hamstring-focused exercise" },
  { id: "12", name: "Leg Curl", muscleGroup: "Legs", description: "Isolation for hamstrings" },
  { id: "13", name: "Leg Extension", muscleGroup: "Legs", description: "Isolation for quadriceps" },
  
  // Shoulders
  { id: "14", name: "Overhead Press", muscleGroup: "Shoulders", description: "Compound shoulder exercise" },
  { id: "15", name: "Lateral Raises", muscleGroup: "Shoulders", description: "Isolation for side delts" },
  { id: "16", name: "Front Raises", muscleGroup: "Shoulders", description: "Front delt isolation" },
  { id: "17", name: "Face Pulls", muscleGroup: "Shoulders", description: "Rear delt and upper back" },
  
  // Arms
  { id: "18", name: "Barbell Curl", muscleGroup: "Arms", description: "Classic bicep exercise" },
  { id: "19", name: "Tricep Dips", muscleGroup: "Arms", description: "Bodyweight tricep exercise" },
  { id: "20", name: "Hammer Curls", muscleGroup: "Arms", description: "Bicep and forearm exercise" },
  { id: "21", name: "Tricep Pushdown", muscleGroup: "Arms", description: "Cable tricep exercise" },
  
  // Core
  { id: "22", name: "Plank", muscleGroup: "Core", description: "Isometric core exercise" },
  { id: "23", name: "Hanging Leg Raises", muscleGroup: "Core", description: "Advanced core exercise" },
  { id: "24", name: "Russian Twists", muscleGroup: "Core", description: "Oblique exercise" },
  { id: "25", name: "Cable Crunches", muscleGroup: "Core", description: "Weighted ab exercise" },
];
