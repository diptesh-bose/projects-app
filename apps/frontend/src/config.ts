const API_URL = 'http://localhost:4000/api';

export const config = {
  apiUrl: API_URL,
  authEndpoints: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    refreshToken: `${API_URL}/auth/refresh-token`,
    logout: `${API_URL}/auth/logout`,
    me: `${API_URL}/auth/me`,
  },
  projectEndpoints: {
    list: `${API_URL}/projects`,
    details: (id: string) => `${API_URL}/projects/${id}`,
    create: `${API_URL}/projects`,
    update: (id: string) => `${API_URL}/projects/${id}`,
    delete: (id: string) => `${API_URL}/projects/${id}`,
  },
  taskEndpoints: {
    list: (projectId: string) => `${API_URL}/tasks/project/${projectId}`,
    create: `${API_URL}/tasks`,
    update: (id: string) => `${API_URL}/tasks/${id}`,
    delete: (id: string) => `${API_URL}/tasks/${id}`,
    updateOrder: (projectId: string) => `${API_URL}/tasks/project/${projectId}/order`,
  },
};