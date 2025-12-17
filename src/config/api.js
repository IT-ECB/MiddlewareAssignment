// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
  },
  chat: `${API_BASE_URL}/api/chat`,
  messages: `${API_BASE_URL}/api/messages`,
}

