import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Trophy, TrendingUp, Dumbbell, Calendar, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Dashboard() {
  const [personalRecords, setPersonalRecords] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalWorkouts: 0, totalExercises: 0, totalVolume: 0 });

  useEffect(() => {
    // Fetch aggregated dashboard stats from PostgreSQL DB Views
    fetch('http://localhost:3000/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data || { totalWorkouts: 0, totalExercises: 0, totalVolume: 0 }))
      .catch(console.error);

    // Fetch personal records from PostgreSQL DB Views
    fetch('http://localhost:3000/api/dashboard/prs')
      .then(res => res.json())
      .then(setPersonalRecords)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your fitness journey and personal records</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-gray-500 mt-1">Sessions completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises Logged</CardTitle>
            <Dumbbell className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-gray-500 mt-1">Different exercises</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">kg lifted</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Records Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personalRecords.length > 0 ? (
            <div className="space-y-4">
              {personalRecords.map((pr, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Target className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{pr.exerciseName}</h4>
                        <p className="text-sm text-gray-500">Max Weight: {pr.maxWeight}kg | Best 1RM: {pr.best1rm}kg</p>
                      </div>
                    </div>
                 </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No personal records yet. Log some workouts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
