import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";
import CreateEvent from "./pages/CreateEvent";
import { useEffect } from "react";
import { useAuthStore } from "./authStore";

import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EditProfile from "./pages/EditProfile";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="w-full pt-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/createEvent/:id"
              element={
                <ProtectedRoute
                  preventGuests={true}
                  guestMessage="Guest users cannot create or edit events. Please create an account."
                >
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createEvent"
              element={
                <ProtectedRoute
                  preventGuests={true}
                  guestMessage="Guest users cannot create events. Please create an account."
                >
                  <CreateEvent />
                </ProtectedRoute>
              }
            />
            <Route path="/events/:id" element={<EventDetails />} />

            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}
