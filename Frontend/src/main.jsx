import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { testBackend } from './utils/api'
import "./index.css";

// Test backend connection on app start
testBackend().then(({ data, error }) => {
  if (error) {
    console.warn('Backend connection test failed:', error);
    console.warn('Make sure the Django backend is running on http://localhost:8000');
  } else {
    console.log('Backend connection successful:', data);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
)
