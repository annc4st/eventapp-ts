import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9001', // Replace with your backend API URL
  withCredentials: true,
});

export default api;