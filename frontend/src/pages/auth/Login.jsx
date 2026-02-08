import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../services/authApi';
import { setCredentials } from '../../store/authSlice';
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
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
        title="Login to Dashboard"
        subtitle="Fill the below form to login"
    >
        {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '0.5rem' }}>
            {error}
            </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder=""
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
                            '& fieldset': { borderColor: '#E0E0E0', borderWidth: '1px' }, // Light gray border by default
                            '&:hover fieldset': { borderColor: '#00BCD4' },
                            '&.Mui-focused fieldset': { borderColor: '#00BCD4', borderWidth: '1px' }, // Primary border on focus
                        },
                         '& .MuiInputLabel-root': { color: '#757575' },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#00BCD4' },
                    }}
                    placeholder=""
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

            <div className="flex items-center justify-between">
                 <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                    Forgot Password?
                </Link>
            </div>

            <Button
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{
                    py: 1.5,
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
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login'}
            </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">
                Sign up
            </Link>
        </p>
    </AuthLayout>
  );
};

export default Login;
