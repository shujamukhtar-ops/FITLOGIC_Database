import { Outlet, Link, useLocation } from "react-router";
import { Home, User, Dumbbell, ClipboardList, History as HistoryIcon } from "lucide-react";

export function Root() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/exercises", label: "Exercises", icon: Dumbbell },
    { path: "/workout", label: "Log Workout", icon: ClipboardList },
    { path: "/history", label: "History", icon: HistoryIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">FitTracker</span>
            </div>
            <div className="flex space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                      isActive
                        ? "border-blue-600 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
