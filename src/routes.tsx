import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { ExerciseLibrary } from "./components/ExerciseLibrary";
import { WorkoutLogger } from "./components/WorkoutLogger";
import { History } from "./components/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "profile", Component: Profile },
      { path: "exercises", Component: ExerciseLibrary },
      { path: "workout", Component: WorkoutLogger },
      { path: "history", Component: History },
    ],
  },
]);
