import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./index.css";
import CreateEvent from "./pages/CreateEvent";
import { useEffect } from "react";
import { useAuthStore } from "./authStore";

export default function App() {
  useEffect(() => {
    useAuthStore.getState().checkUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createEvent" element={<CreateEvent />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}
