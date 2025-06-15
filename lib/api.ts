import { Event } from "../src/authStore";

// const api_url = "https://event-management-backend-10tv.onrender.com";
const api_url = "http://localhost:5000";

// export async function fetchApi(endpoint: string, options: RequestInit = {}) {
//   try {
//     const token = localStorage.getItem("authToken");
//     const response = await fetch(`${api_url}${endpoint}`, {
//       ...options,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "",
//         ...options.headers,
//       },
//     });

//     const text = await response.text();
//     const data = text ? JSON.parse(text) : {};

//     if (!response.ok) {
//       throw new Error(data.message || "Something went wrong");
//     }

//     return data;
//   } catch (error) {
//     if (error instanceof SyntaxError) {
//       throw new Error("Invalid response from server");
//     }
//     throw error;
//   }
// }
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
// export async function fetchApi(endpoint: string, options: RequestInit = {}) {
//   const token = localStorage.getItem("authToken") || "";

//   console.log("🔍 Sending Token:", token); // Debugging

//   try {
//     const response = await fetch(`${api_url}${endpoint}`, {
//       ...options,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token ? `Bearer ${token}` : "", // Ensure proper format
//         ...options.headers,
//       },
//     });

//     const text = await response.text();
//     let data;
//     try {
//       data = text ? JSON.parse(text) : {};
//     } catch (err) {
//       throw new Error("Invalid JSON response from server");
//     }

//     if (!response.ok) {
//       throw new Error(data.message || "Something went wrong");
//     }

//     return data;
//   } catch (error) {
//     console.error("Fetch error:", error.message);
//     throw error;
//   }
// }

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

  updateUser: (data: { username: string }) =>
    fetchApi("/user/update", {
      method: "PUT",
      body: JSON.stringify(data),
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

  updateEvent: (id: string, data: Partial<Event>) =>
    fetchApi(`/events/${id}`, {
      method: "PUT",
      body: data,
    }),

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
