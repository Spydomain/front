import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiFormData = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getBikesApi = () => Api.get('/api/bikes');
export const addBikeApi = (formData) => ApiFormData.post('/api/bikes/add', formData);
export const deleteBikeApi = (id) => Api.delete(`/api/bikes/${id}`);

export const createUserApi = (formData) => ApiFormData.post('/api/user/create', formData);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
