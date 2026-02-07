import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../services/authApi';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Email } from '@mui/icons-material';

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await forgotPassword({ email }).unwrap();
      setSuccess('The password reset link has been sent to your email.');
    } catch (err) {
      setError(err?.data?.detail || 'Failed to send reset link. Please try again.');
    }
  };

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
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#1976d2',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Reset Password
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Enter your email to receive a reset link
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Note Box */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: '1px dashed #1976d2',
            borderRadius: 2,
            bgcolor: 'rgba(25, 118, 210, 0.05)',
          }}
        >
          <Typography variant="body2" sx={{ color: '#1976d2' }}>
            Note: The system will verify whether the entered email exists.
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Enter Email ID"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
              setSuccess('');
            }}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#1a1a2e',
                bgcolor: '#fff',
                '& fieldset': { borderColor: '#1976d2' },
                '&:hover fieldset': { borderColor: '#42a5f5' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
              },
              '& .MuiInputLabel-root': { color: '#666' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
              },
              '&:disabled': {
                background: '#bdbdbd',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit'}
          </Button>
        </form>

        {/* Back to Login Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link
            to="/login"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            ← Back to Login
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
