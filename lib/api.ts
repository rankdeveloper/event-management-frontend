const api_url = "https://event-management-backend-10tv.onrender.com";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${api_url}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

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

  logout: () => fetchApi("/logout", { method: "POST" }),

  getMe: () => fetchApi("/me"),
};
