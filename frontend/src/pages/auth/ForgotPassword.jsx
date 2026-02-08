import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../services/authApi';
import { useToast } from '../../components/ToastProvider';
import AuthLayout from '../../layouts/AuthLayout';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const ForgotPassword = () => {
  const toast = useToast();
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
      toast.success('Reset link sent to your email!');
    } catch (err) {
      setError(err?.data?.detail || 'Failed to send reset link. Please try again.');
      toast.error(err?.data?.detail || 'Failed to send reset link');
    }
  };

  return (
    <AuthLayout 
        title="Reset Password"
        subtitle="Enter your email to receive a reset link"
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

        {/* Note Box */}
        <div className="mb-6 p-4 border border-dashed border-primary/30 rounded-xl bg-primary/5">
          <p className="text-sm text-primary font-medium">
            Note: The system will verify whether the entered email exists.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 ml-1">Email Address *</label>
                <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                        setSuccess('');
                    }}
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
                    placeholder="e.g. name@company.com"
                />
            </div>

            <Button
                type="submit"
                fullWidth
                disabled={isLoading}
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
                {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
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

export default ForgotPassword;
