const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

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
    // Filtrar undefined y strings vacíos antes de construir query
    const clean = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const query = new URLSearchParams(clean).toString();
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

// Helper para descargar archivos binarios (PDFs / Excel)
export const downloadFile = async (url, defaultFilename) => {
  try {
    const token = localStorage.getItem('megapunto_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const res = await fetch(`${baseUrl}${url}`, { headers });
    if (!res.ok) throw new Error('Error al descargar archivo');
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (err) {
    console.error('Error al descargar archivo:', err);
    return false;
  }
};

export const salesAPI = {
  create: (saleData) =>
    apiFetch('/ventas', { method: 'POST', body: JSON.stringify(saleData) }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/ventas${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) =>
    apiFetch(`/ventas/${id}`, { method: 'GET' }),
  getByClient: (clienteId) =>
    apiFetch(`/ventas/cliente/${clienteId}`, { method: 'GET' })
};

export const invoicesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/facturas${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getById: (id) =>
    apiFetch(`/facturas/${id}`, { method: 'GET' }),
  getByClient: (clienteId) =>
    apiFetch(`/facturas/cliente/${clienteId}`, { method: 'GET' }),
  downloadPdf: (id, invoiceNum = 'FAC') =>
    downloadFile(`/api/facturas/${id}/pdf`, `Factura_${invoiceNum}.pdf`)
};

export const reportsAPI = {
  getDaily: (fecha) => {
    const query = fecha ? `?fecha=${fecha}` : '';
    return apiFetch(`/reportes/ventas/diario${query}`, { method: 'GET' });
  },
  downloadDailyPdf: (fecha) =>
    downloadFile(`/api/reportes/ventas/diario/pdf?fecha=${fecha || ''}`, `Reporte_Ventas_${fecha || 'hoy'}.pdf`),
  downloadDailyExcel: (fecha) =>
    downloadFile(`/api/reportes/ventas/diario/excel?fecha=${fecha || ''}`, `Reporte_Ventas_${fecha || 'hoy'}.xlsx`)
};

export const dashboardAPI = {
  getStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/dashboard/stats${query ? `?${query}` : ''}`, { method: 'GET' });
  }
};

export const pqrAPI = {
  create: (pqrData, user = {}) => {
    const params = new URLSearchParams();
    if (user.id || user._id) params.append('cliente_id', user.id || user._id);
    if (user.nombre) params.append('cliente_nombre', `${user.nombre} ${user.apellido || ''}`.trim());
    if (user.email) params.append('cliente_email', user.email);
    const q = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/pqr${q}`, { method: 'POST', body: JSON.stringify(pqrData) });
  },
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/pqr${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  getByClient: (clienteId) =>
    apiFetch(`/pqr/cliente/${clienteId}`, { method: 'GET' }),
  getById: (id) =>
    apiFetch(`/pqr/${id}`, { method: 'GET' }),
  updateStatus: (id, data, atendidoPor) => {
    const q = atendidoPor ? `?atendido_por=${encodeURIComponent(atendidoPor)}` : '';
    return apiFetch(`/pqr/${id}/estado${q}`, { method: 'PATCH', body: JSON.stringify(data) });
  }
};

export const chatbotAPI = {
  sendMessage: (payload) =>
    apiFetch('/chatbot/chat', { method: 'POST', body: JSON.stringify(payload) })
};


