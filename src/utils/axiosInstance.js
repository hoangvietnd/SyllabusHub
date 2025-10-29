import axios from 'axios';

const API_BASE_URL = 'https://illustrations-fairfield-premiere-provisions.trycloudflare.com';
// baseURL: 'https://curriculum-backend-235222027541.us-central1.run.app', // User's commented out baseURL
// baseURL: "http://localhost:8080", // User's commented out baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // SỬA LỖI: Thêm kiểm tra `error.response` để tránh crash khi có lỗi mạng.
    // Chỉ xử lý lỗi 401 khi có phản hồi từ server.
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error("No refresh token, redirecting to login.");
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const rs = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = rs.data;

        localStorage.setItem('accessToken', accessToken);
        processQueue(null, accessToken);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (_error) {
        console.error("Token refresh failed!", _error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        processQueue(_error, null);
        window.location.href = '/login';
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }

    // Đối với các lỗi khác (lỗi mạng, 500, 404...), trả về lỗi để catch block ở nơi gọi API có thể xử lý.
    return Promise.reject(error);
  }
);

export default api;
