const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Generic API fetch function with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      // For 400 errors (validation), return the error data so frontend can display field-specific errors
      if (response.status === 400) {
        return { data: responseData, error: null };
      }
      // For other errors, return as error
      const errorMessage = responseData.error || responseData.message || Object.values(responseData).flat().join(', ') || `HTTP error! status: ${response.status}`;
      return { data: null, error: errorMessage };
    }
    
    return { data: responseData, error: null };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return { data: null, error: error.message || 'Failed to fetch data from server' };
  }
}

/**
 * Test if backend is running
 */
export async function testBackend() {
  try {
    const response = await fetch('http://localhost:8000/');
    if (!response.ok) {
      throw new Error('Backend is not responding');
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Backend test failed:', error);
    return { data: null, error: error.message || 'Backend is not running' };
  }
}

/**
 * User authentication APIs
 */
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

export async function getUserDetails() {
  return apiRequest('/get/user/', {
    method: 'GET',
  });
}

/**
 * Quiz and Prediction APIs
 */
export async function submitQuiz(quizData) {
  return apiRequest('/get/quiz/', {
    method: 'POST',
    body: JSON.stringify(quizData),
  });
}

/**
 * Sentiment Analysis API
 */
export async function analyzeSentiment(text) {
  return apiRequest('/get/sentiment/', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

/**
 * Chatbot API
 */
export async function sendChatMessage(message) {
  return apiRequest('/chat/', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

/**
 * Voice Bot APIs
 */
export async function sendVoiceQuery(query) {
  return apiRequest('/voice/', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function activateVoiceCommand() {
  return apiRequest('/bot/cmd/', {
    method: 'GET',
  });
}
