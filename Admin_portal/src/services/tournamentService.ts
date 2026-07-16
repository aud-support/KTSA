import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;

export const createTournament = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/api/tournament`, data);
  return response.data;
};

export const updateTournament = async (id: string, data: any) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/tournament/${id}`,
    data,
  );
  return response.data;
};

export const deleteTournament = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/api/tournament/${id}`);
  return response.data;
};

export const getTournamentById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/tournament/${id}`);
  return response.data;
};

export const getAllTournaments = async () => {
  // Admin needs all tournaments — request a large page so pagination is transparent
  const response = await axios.get(`${API_BASE_URL}/api/tournament?page=0&size=1000`);
  return response.data;
};

export const getTournamentsByFilter = async (month?: number, year?: number) => {
  const params = new URLSearchParams();
  if (month != null) params.append("month", String(month));
  if (year != null) params.append("year", String(year));
  params.append("page", "0");
  params.append("size", "1000");
  const base = month != null || year != null
    ? `${API_BASE_URL}/api/tournament/filter`
    : `${API_BASE_URL}/api/tournament`;
  const response = await axios.get(`${base}?${params.toString()}`);
  return response.data;
};

/** Returns the distinct years that have at least one tournament. Falls back to a range if DB is empty. */
export const getAvailableYears = async (): Promise<number[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/tournament/available-years`,
    );
    const years: number[] = response.data?.data ?? [];
    if (years.length > 0) return years;
  } catch (e) {
    console.error("[getAvailableYears] Failed:", e);
  }
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);
};

/** Toggle registration open/closed for a tournament. */
export const setRegistrationClosed = async (id: string | number, closed: boolean) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/tournament/${id}/close-registration?closed=${closed}`,
  );
  return response.data;
};
