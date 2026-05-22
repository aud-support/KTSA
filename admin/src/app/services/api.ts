// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
//   headers: { 'Content-Type': 'application/json' },
// });

// // Attach JWT to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('admin_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Auto-logout on 401
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('admin_token');
//       localStorage.removeItem('admin_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// // ── Auth ────────────────────────────────────────────────────────
// export const authApi = {
//   login: (email: string, password: string) =>
//     api.post('/api/auth/login', { email, password }),
// };

// // ── CMS ─────────────────────────────────────────────────────────
// export const cmsApi = {
//   getSection: (section: string) => api.get(`/api/admin/cms/${section}`),
//   updateSection: (section: string, data: unknown) =>
//     api.put(`/api/admin/cms/${section}`, data),
// };

// // ── Tournaments ──────────────────────────────────────────────────
// export const tournamentApi = {
//   getAll: () => api.get('/api/admin/tournaments'),
//   getById: (id: number) => api.get(`/api/admin/tournaments/${id}`),
//   create: (data: unknown) => api.post('/api/admin/tournaments', data),
//   update: (id: number, data: unknown) => api.put(`/api/admin/tournaments/${id}`, data),
//   delete: (id: number) => api.delete(`/api/admin/tournaments/${id}`),
// };

// // ── News ────────────────────────────────────────────────────────
// export const newsApi = {
//   getAll: () => api.get('/api/admin/news'),
//   create: (data: unknown) => api.post('/api/admin/news', data),
//   update: (id: number, data: unknown) => api.put(`/api/admin/news/${id}`, data),
//   delete: (id: number) => api.delete(`/api/admin/news/${id}`),
// };

// // ── Sponsors ────────────────────────────────────────────────────
// export const sponsorApi = {
//   getAll: () => api.get('/api/admin/sponsors'),
//   create: (data: unknown) => api.post('/api/admin/sponsors', data),
//   update: (id: number, data: unknown) => api.put(`/api/admin/sponsors/${id}`, data),
//   delete: (id: number) => api.delete(`/api/admin/sponsors/${id}`),
// };

// export default api;
