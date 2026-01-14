const endpoints = {
  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  
  // Table endpoints
  tables: {
    getAll: '/api/tables',
    create: '/api/tables',
    update: (id) => `/api/tables/${id}`,
    delete: (id) => `/api/tables/${id}`,
    available: '/api/tables/available',
    updateByNumber: (number) => `/api/tables/number/${number}`,
  },
  
  // Reservation endpoints
  reservations: {
    getAll: '/api/reservations',
    create: '/api/reservations',
    updateStatus: (id) => `/api/reservations/${id}/status`,
    delete: (id) => `/api/reservations/${id}`,
  },
  
  // Staff endpoints
  staff: {
    getAll: '/api/staff',
    create: '/api/staff',
    update: (id) => `/api/staff/${id}`,
    delete: (id) => `/api/staff/${id}`,
  },
  
  // Analytics endpoint
  analytics: '/api/analytics',
  
  // Dashboard endpoint - CORRECTED
  dashboard: {
    stats: '/api/dashboard/stats',  // Note: not /api/dashboard
  },
  
  // Demo data endpoint
  demo: '/api/create-demo-data',
  
  // Debug endpoints
  debug: {
    reservations: '/api/debug/reservations/all',
    status: '/api/debug/status',
    dbTest: '/api/test/db',
  },
  
  // Health check
  health: '/api/health',
};

export default endpoints;