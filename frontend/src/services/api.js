import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const sensorService = {
  getSensors: async () => {
    const response = await apiClient.get('/sensors');
    return response.data;
  },
};

export const diseaseService = {
  predictDisease: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post('/scans/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default apiClient;
