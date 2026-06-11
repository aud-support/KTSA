import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ADMIN_BACKEND_BASE_URL;
// const API_BASE_URL = "http://localhost:8080/api/tournaments";

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
  const response = await axios.get(`${API_BASE_URL}/api/tournament`);

  return response.data;
};
