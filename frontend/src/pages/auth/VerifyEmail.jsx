import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../services/authApi';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  
  // Prevent double execution in React StrictMode
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      // Prevent double execution
      if (hasVerified.current) {
        return;
      }
      hasVerified.current = true;

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        await verifyEmail({ token }).unwrap();
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err?.data?.detail || 'Email verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #1976d2',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)',
          textAlign: 'center',
        }}
      >
        {/* Loading State */}
        {status === 'verifying' && (
          <>
            <CircularProgress size={60} sx={{ color: '#1976d2', mb: 3 }} />
            <Typography variant="h5" sx={{ color: '#1a1a2e', mb: 2 }}>
              Verifying Your Email...
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Please wait while we verify your email address.
            </Typography>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 3 }} />
            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700, mb: 2 }}>
              Email Verified!
            </Typography>
            <Alert severity="success" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                },
              }}
            >
              Proceed to Login
            </Button>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: '#f44336', mb: 3 }} />
            <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700, mb: 2 }}>
              Verification Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                py: 1.5,
                px: 4,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
                },
              }}
            >
              Back to Login
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
