import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignupMutation } from '../../services/authApi';
import { useToast } from '../../components/ToastProvider';
import AuthLayout from '../../layouts/AuthLayout';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Apple } from '@mui/icons-material';

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [signup, { isLoading }] = useSignupMutation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('one special character');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      await signup(submitData).unwrap();
      toast.success('Account created! Redirecting to login...');
      setSuccess('Account created! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err?.data?.detail || 'Signup failed. Please try again.');
    }
  };

  const inputSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
        color: '#1a1a2e',
        bgcolor: '#f8fafc',
        borderRadius: '0.75rem',
        '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1px' },
        '&:hover fieldset': { borderColor: '#cbd5e1' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#6366f1' },
  };

  return (
    <AuthLayout
        title="Create Account"
        subtitle="Sign up for a new IQMS account"
    >
        {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '0.5rem' }}>
            {error}
            </Alert>
        )}
        {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '0.5rem' }}>
            {success}
            </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Full Name *</label>
                <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#1a1a2e',
                            bgcolor: '#FFFFFF',
                            borderRadius: '0.5rem',
                            '& fieldset': { borderColor: '#E0E0E0', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: '#00BCD4' },
                            '&.Mui-focused fieldset': { borderColor: '#00BCD4', borderWidth: '1px' },
                        },
                        '& .MuiInputLabel-root': { color: '#757575' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#00BCD4' },
                    }}
                    placeholder="Enter your full name"
                    InputProps={{ style: { fontSize: '0.95rem' } }}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Email *</label>
                 <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#1a1a2e',
                            bgcolor: '#FFFFFF',
                            borderRadius: '0.5rem',
                            '& fieldset': { borderColor: '#E0E0E0', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: '#00BCD4' },
                            '&.Mui-focused fieldset': { borderColor: '#00BCD4', borderWidth: '1px' },
                        },
                        '& .MuiInputLabel-root': { color: '#757575' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#00BCD4' },
                    }}
                    placeholder="Enter email address"
                    InputProps={{ style: { fontSize: '0.95rem' } }}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Password *</label>
                 <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#1a1a2e',
                            bgcolor: '#FFFFFF',
                            borderRadius: '0.5rem',
                            '& fieldset': { borderColor: '#E0E0E0', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: '#00BCD4' },
                            '&.Mui-focused fieldset': { borderColor: '#00BCD4', borderWidth: '1px' },
                        },
                        '& .MuiInputLabel-root': { color: '#757575' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#00BCD4' },
                    }}
                    placeholder="Create a password"
                    InputProps={{
                        style: { fontSize: '0.95rem' },
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#94a3b8' }}
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Confirm Password *</label>
                 <TextField
                    fullWidth
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#1a1a2e',
                            bgcolor: '#FFFFFF',
                            borderRadius: '0.5rem',
                            '& fieldset': { borderColor: '#E0E0E0', borderWidth: '1px' },
                            '&:hover fieldset': { borderColor: '#00BCD4' },
                            '&.Mui-focused fieldset': { borderColor: '#00BCD4', borderWidth: '1px' },
                        },
                        '& .MuiInputLabel-root': { color: '#757575' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#00BCD4' },
                    }}
                    placeholder="Confirm your password"
                    InputProps={{
                        style: { fontSize: '0.95rem' },
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            sx={{ color: '#94a3b8' }}
                            >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
            </div>

            <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{
                    py: 1.5,
                    mt: 2,
                    bgcolor: '#00BCD4', // Primary Cyan
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#0097A7', // Primary Dark
                        boxShadow: 'none',
                    },
                }}
            >
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
            </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Login
            </Link>
        </p>
    </AuthLayout>
  );
};

export default Signup;
