import api from './api';

// Auth Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/participant', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Event Services
export const eventService = {
  getAllEvents: async (filters) => {
    const response = await api.get('/events', { params: filters });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  getTrendingEvents: async () => {
    const response = await api.get('/events/trending');
    return response.data;
  }
};

// Participant Services
export const participantService = {
  getProfile: async () => {
    const response = await api.get('/participants/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/participants/profile', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/participants/dashboard');
    return response.data;
  },

  followOrganizer: async (organizerId) => {
    const response = await api.post(`/participants/follow/${organizerId}`);
    return response.data;
  }
};

// Organizer Services
export const organizerService = {
  getProfile: async () => {
    const response = await api.get('/organizers/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/organizers/profile', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/organizers/dashboard');
    return response.data;
  },

  getAllOrganizers: async () => {
    const response = await api.get('/organizers');
    return response.data;
  }
};

// Registration Services
export const registrationService = {
  registerForEvent: async (registrationData) => {
    const response = await api.post('/registrations', registrationData);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations');
    return response.data;
  },

  cancelRegistration: async (registrationId) => {
    const response = await api.delete(`/registrations/${registrationId}`);
    return response.data;
  }
};

// Admin Services
export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  createOrganizer: async (organizerData) => {
    const response = await api.post('/admin/organizers', organizerData);
    return response.data;
  },

  getAllOrganizers: async () => {
    const response = await api.get('/admin/organizers');
    return response.data;
  },

  deleteOrganizer: async (organizerId) => {
    const response = await api.delete(`/admin/organizers/${organizerId}`);
    return response.data;
  }
};
