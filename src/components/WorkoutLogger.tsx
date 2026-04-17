import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Save, Plus, Trash2, Dumbbell, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function WorkoutLogger() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<any[]>([]); // Data from PostgreSQL
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch('http://localhost:3000/api/exercises')
      .then(res => res.json())
      .then(data => setExercises(data))
      .catch(console.error);
  }, []);

  const addExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    if (selectedExercises.some(e => e.exerciseId === exerciseId)) {
       toast.error("Exercise already added.");
       return;
    }

    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscle_group,
        sets: [{ setNumber: 1, reps: 0, weight: 0 }]
      }
    ]);
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.exerciseId !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.exerciseId === exerciseId) {
        const nextSetNumber = ex.sets.length > 0 ? Math.max(...ex.sets.map((s: any) => s.setNumber)) + 1 : 1;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, { setNumber: nextSetNumber, weight: lastSet?.weight || 0, reps: lastSet?.reps || 0 }]
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setNumber: number) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.exerciseId === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.filter((s: any) => s.setNumber !== setNumber)
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setNumber: number, field: string, value: number) => {
    setSelectedExercises(selectedExercises.map(ex => {
      if (ex.exerciseId === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map((s: any) => s.setNumber === setNumber ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const handleSaveWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast.error("Please add at least one exercise.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, exercises: selectedExercises })
      });

      if (response.ok) {
        toast.success("Workout successfully saved!");
        navigate("/");
      } else {
        toast.error("Failed to save workout to PostgreSQL");
      }
    } catch (err) {
      toast.error("Server currently unreachable!");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Workout</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveWorkout}>
            <Save className="w-4 h-4 mr-2" /> Finish
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Add Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={addExercise}>
            <SelectTrigger>
              <SelectValue placeholder="Select an exercise from DB..." />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((ex) => (
                <SelectItem key={ex.id} value={ex.id}>
                  {ex.name} <span className="text-gray-400">({ex.muscle_group})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedExercises.length > 0 && (
        <div className="space-y-6">
          {selectedExercises.map(exercise => (
            <Card key={exercise.exerciseId}>
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center gap-3">
                     <Dumbbell className="text-blue-600"/>
                     <div>
                       <CardTitle>{exercise.name}</CardTitle>
                       <Badge variant="secondary" className="mt-1">{exercise.muscleGroup}</Badge>
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.exerciseId)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 mb-2">
                    <div className="col-span-2 text-center">Set</div>
                    <div className="col-span-4 pl-4">Weight (kg)</div>
                    <div className="col-span-4 pl-4">Reps</div>
                    <div className="col-span-2 text-center"></div>
                  </div>
                  
                  {exercise.sets.map((set: any, index: number) => (
                    <div key={set.setNumber} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-2 text-center font-medium bg-gray-100 py-2 rounded-md">
                        {index + 1}
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={set.weight === 0 ? "" : set.weight}
                          onChange={(e) => updateSet(exercise.exerciseId, set.setNumber, "weight", parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.5"
                          placeholder="e.g. 60"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          type="number"
                          value={set.reps === 0 ? "" : set.reps}
                          onChange={(e) => updateSet(exercise.exerciseId, set.setNumber, "reps", parseInt(e.target.value) || 0)}
                          min="0"
                          placeholder="e.g. 10"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSet(exercise.exerciseId, set.setNumber)}
                          disabled={exercise.sets.length === 1}
                        >
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSet(exercise.exerciseId)}
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Set
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedExercises.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle className="text-lg">Workout Notes</CardTitle>
             <CardDescription>Optional thoughts on today's session</CardDescription>
           </CardHeader>
           <CardContent>
             <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Feeling strong..." />
           </CardContent>
         </Card>
      )}
    </div>
  );
}
