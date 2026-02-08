import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

// Create context
const ToastContext = createContext(null);

// Slide transition for toast - slide from right
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Custom light colors for each severity
const getAlertStyles = (severity) => {
  const colors = {
    success: { bgcolor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' },
    error: { bgcolor: '#ffebee', color: '#c62828', borderColor: '#ef9a9a' },
    warning: { bgcolor: '#fff8e1', color: '#f57f17', borderColor: '#ffe082' },
    info: { bgcolor: '#e3f2fd', color: '#1565c0', borderColor: '#90caf9' },
  };
  return colors[severity] || colors.info;
};

/**
 * ToastProvider - Global toast notification provider
 * Wraps the app and provides showToast function
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success' | 'error' | 'warning' | 'info'
    duration: 2000,
  });

  const showToast = useCallback((message, severity = 'success', duration = 4000) => {
    setToast({
      open: true,
      message,
      severity,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Helper functions for specific types
  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

  const alertStyles = getAlertStyles(toast.severity);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
        sx={{ mt: 2, mr: 2 }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="standard"
          sx={{
            width: '100%',
            minWidth: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            borderRadius: 2,
            fontWeight: 500,
            border: `1px solid ${alertStyles.borderColor}`,
            bgcolor: alertStyles.bgcolor,
            color: alertStyles.color,
            '& .MuiAlert-icon': {
              fontSize: 24,
              color: alertStyles.color,
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

/**
 * useToast - Hook to access toast functions
 * @returns {{ showToast, success, error, warning, info }}
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
