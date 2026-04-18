// Use relative /api in dev (proxied by Vite) to avoid NetworkError
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get auth token from localStorage
 */
function getAuthHeaders() {
  const tokens = localStorage.getItem('tokens');
  if (tokens) {
    const { access } = JSON.parse(tokens);
    if (access) {
      return { 'Authorization': `Bearer ${access}` };
    }
  }
  return {};
}

/**
 * Try to refresh the access token
 */
async function refreshAccessToken() {
  const tokens = localStorage.getItem('tokens');
  if (!tokens) return null;

  const { refresh } = JSON.parse(tokens);
  if (!refresh) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (response.ok) {
      const data = await response.json();
      const updated = { ...JSON.parse(tokens), access: data.access };
      if (data.refresh) updated.refresh = data.refresh;
      localStorage.setItem('tokens', JSON.stringify(updated));
      return data.access;
    }
  } catch (e) {
    console.error('Token refresh failed:', e);
  }
  return null;
}

/**
 * Generic API fetch with JWT auth and auto-refresh
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    ...(options.skipContentType ? {} : { 'Content-Type': 'application/json' }),
    ...getAuthHeaders(),
  };

  const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  // Remove our custom flags
  delete config.skipContentType;

  try {
    let response = await fetch(url, config);

    // If 401, try refreshing the token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        config.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, config);
      }
    }

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 400) {
        return { data: responseData, error: null };
      }
      const errorMessage = responseData.error || responseData.message ||
        Object.values(responseData).flat().join(', ') ||
        `HTTP error! status: ${response.status}`;
      return { data: null, error: errorMessage };
    }

    return { data: responseData, error: null };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { data: null, error: error.message || 'Failed to fetch data from server' };
  }
}

// ---- Auth APIs ----
export async function signUp(userData) {
  return apiRequest('/auth/signup/', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function signIn(credentials) {
  return apiRequest('/auth/signin/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getUserProfile() {
  return apiRequest('/profile/', { method: 'GET' });
}

export async function updateUserProfile(data) {
  return apiRequest('/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ---- Quiz & Prediction ----
export async function submitQuiz(quizData) {
  return apiRequest('/get/quiz/', {
    method: 'POST',
    body: JSON.stringify(quizData),
  });
}

export async function getPredictionHistory() {
  return apiRequest('/predictions/history/', { method: 'GET' });
}

// ---- Sentiment ----
export async function analyzeSentiment(text) {
  return apiRequest('/get/sentiment/', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// ---- Resume ----
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  return apiRequest('/resume/upload/', {
    method: 'POST',
    body: formData,
    skipContentType: true, // Let browser set multipart boundary
  });
}

export async function getResumeHistory() {
  return apiRequest('/resume/history/', { method: 'GET' });
}

// ---- Guidance ----
export async function getCareerGuidance(role) {
  return apiRequest('/guidance/', {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}

// ---- Jobs ----
export async function searchJobs(role, type = 'all', location = '') {
  return apiRequest('/jobs/', {
    method: 'POST',
    body: JSON.stringify({ role, type, location }),
  });
}

// ---- Chat & Voice ----
export async function sendChatMessage(message) {
  return apiRequest('/chat/', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function sendVoiceQuery(query) {
  return apiRequest('/voice/', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function activateVoiceCommand() {
  return apiRequest('/bot/cmd/', { method: 'GET' });
}
