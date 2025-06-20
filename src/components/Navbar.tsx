import { Link } from "react-router-dom";
import { Calendar, LogIn, LogOut, UserPlus } from "lucide-react";
import { useAuthStore } from "../authStore";

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  console.log("user : ", user);

  return (
    <nav className="bg-white shadow-md  fixed w-full z-50 ">
      <div className="mx-auto px-4 xl:px-16">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">Evenza</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {user.isGuest ? (
                  <span className="bg-gray-400 text-gray-500 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed">
                    Create Event
                  </span>
                ) : (
                  <Link
                    to="/createEvent"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Create Event
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
