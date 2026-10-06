import { Link, NavLink } from "react-router-dom";
import {
  Calendar,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  UserCircle,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useAuthStore } from "../authStore";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full z-50 shadow-sm">
      <div className="mx-auto px-4 xl:px-16">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Evenza</span>
          </Link>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/createEvent"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`
                  }
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Event
                </NavLink>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
                <NavLink
                  to="profile/edit"
                  className="ml-1 flex items-center hover:opacity-80 transition-opacity"
                >
                  {user.pic ? (
                    <img
                      src={user?.pic}
                      alt="profile"
                      className="h-9 w-9 rounded-full ring-2 ring-indigo-200 object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-200">
                      <UserCircle className="text-indigo-600 h-6 w-6" />
                    </div>
                  )}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                    }`
                  }
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-700 text-white"
                        : "text-white bg-indigo-600 hover:bg-indigo-700"
                    }`
                  }
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-100 py-3 space-y-1"
            >
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/createEvent"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Event
                  </Link>
                  <NavLink
                    to="profile/edit"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {user.pic ? (
                      <img src={user?.pic} alt="profile" className="h-6 w-6 rounded-full object-cover" />
                    ) : (
                      <UserCircle className="text-indigo-500 h-6 w-6" />
                    )}
                    Profile
                  </NavLink>
                  <button
                    onClick={() => { signOut(); toggleMenu(); }}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
