import { useEffect, useState } from "react";
import { Calendar, ChevronRight, Dumbbell, Award, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export function History() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const prs: any[] = [];

  useEffect(() => {
    fetch('http://localhost:3000/api/workouts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWorkouts(data);
      })
      .catch(err => console.error("Database connection failed", err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Workout History</h1>
        <p className="mt-2 text-gray-600">Review your past sessions</p>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No workout data available. Log a session to see it here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout: any) => (
             <Card key={workout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>{format(new Date(workout.date), "MMMM d, yyyy")}</CardTitle>
                      {workout.notes && <p className="text-gray-600 text-sm">{workout.notes}</p>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises?.map((exercise: any) => (
                    <div key={exercise.id} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{exercise.name}</h4>
                      <div className="space-y-2">
                        {exercise.sets?.map((set: any) => (
                          <div key={set.set_number} className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Set {set.set_number}</span>
                            <div className="flex gap-4">
                              <span className="font-medium">{set.weight} kg</span>
                              <span className="text-gray-500">×</span>
                              <span className="font-medium">{set.reps} reps</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
