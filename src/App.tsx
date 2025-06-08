import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";
import CreateEvent from "./pages/CreateEvent";
import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EditEvent from "./pages/EditEvent";
import EditProfile from "./pages/EditProfile";

export default function App() {
  // useEffect(() => {
  //   const auth = useAuthStore.getState().checkUser();
  //   console.log("auth", auth);
  // }, []);
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createEvent" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/edit" element={<EditEvent />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}
