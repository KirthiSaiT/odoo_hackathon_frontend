import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthProvider from './components/AuthProvider';
import { ToastProvider } from './components/ToastProvider';
import { PermissionProvider } from './contexts/PermissionContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <PermissionProvider>
            <App />
          </PermissionProvider>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  </StrictMode>
);
