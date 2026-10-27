// Backend URL comes from the environment so the same code works locally and in the cloud.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(API_URL + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  health: () => request("/api/health"),
  list: () => request("/api/notes"),
  create: (note) => request("/api/notes", { method: "POST", body: JSON.stringify(note) }),
  update: (id, note) => request(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(note) }),
  remove: (id) => request(`/api/notes/${id}`, { method: "DELETE" }),
};
