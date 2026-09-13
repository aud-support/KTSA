import axios from "axios";

const API_BASE = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL ?? "http://localhost:8080";

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function bulkImportUsers(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/users/bulk-import`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? "Bulk import failed");
  }

  return res.json();
}
