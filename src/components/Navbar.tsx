import { Link, NavLink } from "react-router-dom";
import {
  Calendar,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { useAuthStore } from "../authStore";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import profile from "../assets/avatar.jpg";

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="mx-auto px-4 xl:px-16">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">Evenza</span>
          </Link>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `  px-3 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600"
                    } `
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/createEvent"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md text-sm font-medium ${
                      isActive
                        ? " text-indigo-500"
                        : " text-gray-700 hover:text-indigo-500"
                    }`
                  }
                >
                  Create Event
                </NavLink>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>

                <NavLink
                  to="profile/edit"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {user.pic ? (
                    <img
                      src={profile}
                      alt="profile"
                      className="2xl:h-10 sm:h-8  2xl:w-10 sm:w-8 rounded-full"
                    />
                  ) : (
                    <UserCircle className="text-indigo-500 h-8 w-8 2xl:h-10 2xl:w-10" />
                  )}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center space-x-1  hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive ? "text-indigo-600" : "text-gray-700"
                    }`
                  }
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `flex items-center space-x-1  px-4 py-2 rounded-md text-sm font-medium  ${
                      isActive
                        ? " bg-white text-indigo-600 border border-indigo-600 "
                        : "text-white bg-indigo-600 hover:bg-indigo-700"
                    }`
                  }
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* //mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 120,
                bounce: 0.3,
              }}
              className={`transition-all duration-300 ease-in-out md:hidden mt-2 space-y-2 pb-4 ${
                !menuOpen ? "!min-h-[10rem]" : ""
              } `}
            >
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={toggleMenu}
                    className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/createEvent"
                    onClick={toggleMenu}
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Create Event
                  </Link>

                  <NavLink
                    to="profile/edit"
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {user.pic ? (
                      <>
                        <img
                          src={profile}
                          alt="profile"
                          className="2xl:h-10 sm:h-8  2xl:w-10 sm:w-8 rounded-full"
                        />
                        <span className="ps-2">Profile</span>
                      </>
                    ) : (
                      <UserCircle className="text-indigo-500 h-8 w-8 2xl:h-10 2xl:w-10" />
                    )}
                  </NavLink>

                  <button
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
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
                    onClick={toggleMenu}
                    className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
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
