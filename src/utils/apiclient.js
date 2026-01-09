const axios = require('axios');

// Client untuk komunikasi ke auth-service
const authClient = axios.create({
    baseURL: 'https://auth-service-five-nu.vercel.app',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Service-Name': 'inventory-service'
    }
});

// Interceptor
authClient.interceptors.request.use(
    config => {
        console.log(`📤 Request to AUTH: ${config.url}`);
        return config;
    },
    error => {
        console.error('❌ Request to auth error:', error.message);
        return Promise.reject(error);
    }
);

authClient.interceptors.response.use(
    response => {
        console.log(`📥 Response from AUTH: ${response.status}`);
        return response;
    },
    error => {
        console.error('❌ Response from auth error:', error.message);
        return Promise.reject(error);
    }
);

module.exports = { authClient };