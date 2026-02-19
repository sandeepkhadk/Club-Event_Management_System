// src/api.js
const apiUrl = import.meta.env.VITE_API_URL; // from .env

export async function fetchData(endpoint) {
  try {
    const res = await fetch(`${apiUrl}${endpoint}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    return null;
  }
}

export default apiUrl;
