import { Event } from "../src/authStore";

// const api_url = "https://event-management-backend-10tv.onrender.com";
const api_url = "http://localhost:5000";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem("authToken") || "";
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${api_url}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error("Invalid JSON response from server");
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid response from server");
    }
    throw error;
  }
}

export const auth = {
  register: (data: { email: string; password: string; username: string }) =>
    fetchApi("/user/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi("/user/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () => fetchApi("/user/logout", { method: "POST" }),

  getMe: () => fetchApi("/user/me", { method: "GET" }),

  updateUser: (data: FormData) =>
    fetchApi("/user/update", {
      method: "PUT",
      body: data,
    }),
};

export const events = {
  createEvent: (
    // data: Omit<Event, "_id" | "createdBy" | "attendees" | "createdAt">
    data: FormData
  ) =>
    fetchApi("/events", {
      method: "POST",
      body: data,
    }),

  getEvents: () => fetchApi("/events"),

  getEvent: (id: string) => fetchApi(`/events/${id}`),

  updateEvent: (id: string, data: FormData) =>
    fetchApi(`/events/${id}`, {
      method: "PUT",
      body: data,
    }),
  getStats: () => fetchApi("/events/stats"),

  completedEvent: (id: string, data: { completed: boolean }) =>
    fetchApi(`/events/completed/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteEvent: (id: string) =>
    fetchApi(`/events/${id}`, {
      method: "DELETE",
    }),

  registerEvent: (id: string) =>
    fetchApi(`/events/${id}/register`, {
      method: "POST",
    }),

  unregisterEvent: (id: string) =>
    fetchApi(`/events/${id}/register`, {
      method: "DELETE",
    }),
};
