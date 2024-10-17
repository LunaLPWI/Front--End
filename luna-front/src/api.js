import axios from 'axios';

const api = axios.create({
    baseURL: "https://670465bbab8a8f892733c308.mockapi.io" 
});

export default api;
