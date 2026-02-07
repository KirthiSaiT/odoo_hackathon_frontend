import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../services/authApi';
import { setCredentials } from '../../store/authSlice';
import { useToast } from '../../components/ToastProvider';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      toast.success(`Welcome back, ${result.user?.name || 'User'}!`);
      
      // Role-based redirect: Admin/Employee → /home (with sidebar), User → /user/home (no sidebar)
      const isAdminOrEmployee = 
        result.user?.role === 'ADMIN' || 
        result.user?.role === 'EMPLOYEE' ||
        result.user?.role_id === 1 || 
        result.user?.role_id === 2;
      
      if (isAdminOrEmployee) {
        navigate('/home');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      setError(err?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '',
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
            Welcome Back To Bailley
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Sign in to your account
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email Id"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
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
              '& input': {
                '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
                  WebkitBoxShadow: '0 0 0 30px white inset !important',
                  WebkitTextFillColor: '#1a1a2e !important',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#1a1a2e',
                bgcolor: '#fff',
                '& fieldset': { borderColor: '#1976d2' },
                '&:hover fieldset': { borderColor: '#42a5f5' },
                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
              },
              '& .MuiInputLabel-root': { color: '#666' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#1976d2' },
              '& input': {
                '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
                  WebkitBoxShadow: '0 0 0 30px white inset !important',
                  WebkitTextFillColor: '#1a1a2e !important',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#666' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Link
              to="/forgot-password"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Forgot Password?
            </Link>
          </Box>

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
            {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
          </Button>
        </form>

        {/* Sign Up Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
