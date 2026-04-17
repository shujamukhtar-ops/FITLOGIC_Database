import { useState, useEffect } from "react";
import { User, Scale, Ruler, Activity, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { UserProfile } from "../types";

export function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "uuid-placeholder",
    name: "",
    height: 0,
    weight: 0,
    createdAt: new Date().toISOString(),
  });

  // Fetch the created user on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // just load the latest user for now
          setProfile(data[data.length - 1]);
        }
      })
      .catch(err => console.error("Database connection failed", err));
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          height: profile.height,
          weight: profile.weight
        })
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      toast.error("Server currently unreachable! Start it with \"npx tsx server.ts\".");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="text-blue-600" />
            <div>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your stats to keep tracking accurate</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="John Doe" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={profile.height || ""} onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={profile.weight || ""} onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })} />
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
