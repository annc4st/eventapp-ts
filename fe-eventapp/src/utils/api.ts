import axios from 'axios';
// import store from '../store/store';

const api = axios.create({
  baseURL: 'http://localhost:9001',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use((config) => {
//   const state = store.getState();
//   const token = state.user.token;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

 
 export default api;