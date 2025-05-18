import axios from 'axios';

// Obtener el token del localStorage
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.token || null;
  } catch {
    return null;
  }
};

export const secureAxios = axios.create();

secureAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (!token) {
      throw new Error("No hay token disponible. Usuario no autenticado.");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

