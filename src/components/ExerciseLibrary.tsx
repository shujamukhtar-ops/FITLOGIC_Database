import { useState } from "react";
import { Search, Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { exerciseLibrary } from "../data/exercises";

export function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);

  const muscleGroups = Array.from(new Set(exerciseLibrary.map(ex => ex.muscleGroup)));

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscleGroup = !selectedMuscleGroup || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscleGroup;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
        <p className="mt-2 text-gray-600">Browse and search exercises by muscle group</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Muscle Group Filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedMuscleGroup === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedMuscleGroup(null)}
              >
                All
              </Badge>
              {muscleGroups.map((group) => (
                <Badge
                  key={group}
                  variant={selectedMuscleGroup === group ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedMuscleGroup(group)}
                >
                  {group}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Dumbbell className="w-8 h-8 text-blue-600" />
                <Badge variant="secondary">{exercise.muscleGroup}</Badge>
              </div>
              <CardTitle className="mt-4">{exercise.name}</CardTitle>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No exercises found</p>
        </div>
      )}

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold">{filteredExercises.length}</span> of{" "}
            <span className="font-semibold">{exerciseLibrary.length}</span> exercises
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
