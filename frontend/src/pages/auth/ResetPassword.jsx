import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../../services/authApi';
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Prevent double submission
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

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
    
    // Prevent double submission
    if (isSubmitting.current) {
      return;
    }
    
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(formData.new_password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }

    isSubmitting.current = true;

    try {
      await resetPassword({
        token,
        new_password: formData.new_password,
      }).unwrap();
      setSuccess('Password reset successfully! Redirecting to login...');
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      isSubmitting.current = false;
      setError(err?.data?.detail || 'Failed to reset password. Please try again.');
      toast.error(err?.data?.detail || 'Failed to reset password');
    }
  };

  const fieldSx = {
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
  };

  return (
    <AuthLayout 
        title="Set New Password"
        subtitle="Enter your new secure password below"
    >
        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">New Password *</label>
                <TextField
                    fullWidth
                    name="new_password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    disabled={!token}
                    sx={fieldSx}
                    InputProps={{
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
                <p className="text-[10px] text-gray-500 mt-1 ml-1 leading-tight">
                    Min 8 chars, 1 uppercase, 1 lowercase, 1 special char
                </p>
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Confirm New Password *</label>
                <TextField
                    fullWidth
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    disabled={!token}
                    sx={fieldSx}
                    InputProps={{
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

            {/* Submit Button */}
            <Button
                type="submit"
                fullWidth
                disabled={isLoading || !token}
                sx={{
                    py: 1.5,
                    bgcolor: '#00BCD4',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#0097A7',
                        boxShadow: 'none',
                    },
                }}
            >
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update Password'}
            </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Back to Login
            </Link>
        </p>
    </AuthLayout>
  );
};

export default ResetPassword;
