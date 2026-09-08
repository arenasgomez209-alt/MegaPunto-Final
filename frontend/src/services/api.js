const API_BASE_URL = 'http://localhost:8000/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('megapunto_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: res.statusText };
    }

    // Normalizar mensajes de FastAPI (detail -> message)
    if (!res.ok && data?.detail) {
      if (typeof data.detail === 'string') {
        data.message = data.detail;
      } else if (Array.isArray(data.detail)) {
        data.message = data.detail.map(d => d.msg || d.message).join('. ');
      }
    }

    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    return {
      ok: false,
      status: 500,
      data: { success: false, message: 'No se pudo conectar con el servidor backend FastAPI (http://localhost:8000).' }
    };
  }
};

export const authAPI = {
  login: (credentials) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) =>
    apiFetch('/usuarios/registro', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () =>
    apiFetch('/auth/profile', { method: 'GET' }),
  updateProfile: (profileData) =>
    apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) })
};

export const usersAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/usuarios${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) =>
    apiFetch(`/usuarios/${id}`, { method: 'GET' }),
  create: (userData) =>
    apiFetch('/usuarios/registro', { method: 'POST', body: JSON.stringify(userData) }),
  update: (id, userData) =>
    apiFetch(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  toggleStatus: (id) =>
    apiFetch(`/usuarios/${id}/estado`, { method: 'PATCH' }),
  delete: (id) =>
    apiFetch(`/usuarios/${id}`, { method: 'DELETE' })
};

export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/productos${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) =>
    apiFetch(`/productos/${id}`, { method: 'GET' }),
  create: (productData) =>
    apiFetch('/productos', { method: 'POST', body: JSON.stringify(productData) }),
  update: (id, productData) =>
    apiFetch(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  delete: (id) =>
    apiFetch(`/productos/${id}`, { method: 'DELETE' })
};

export const servicesAPI = {
  getAll: () =>
    apiFetch('/servicios', { method: 'GET' }),
  getById: (id) =>
    apiFetch(`/servicios/${id}`, { method: 'GET' }),
  create: (serviceData) =>
    apiFetch('/servicios', { method: 'POST', body: JSON.stringify(serviceData) }),
  update: (id, serviceData) =>
    apiFetch(`/servicios/${id}`, { method: 'PUT', body: JSON.stringify(serviceData) }),
  delete: (id) =>
    apiFetch(`/servicios/${id}`, { method: 'DELETE' })
};

export const contactAPI = {
  send: (contactData) =>
    apiFetch('/contacto', { method: 'POST', body: JSON.stringify(contactData) }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/contacto${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  updateStatus: (id, estado) =>
    apiFetch(`/contacto/${id}/status`, { method: 'PATCH', body: JSON.stringify({ estado }) })
};

