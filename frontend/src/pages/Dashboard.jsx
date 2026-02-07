import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import { Logout, Person, Business } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
        padding: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#42a5f5',
              bgcolor: 'rgba(25, 118, 210, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* User Card */}
      <Paper
        elevation={24}
        sx={{
          maxWidth: 500,
          p: 4,
          borderRadius: 3,
          background: '#ffffff',
          border: '1px solid #1976d2',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#1976d2',
              fontSize: '2rem',
              mr: 3,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: '#1a1a2e', fontWeight: 600 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {user?.email}
            </Typography>
            <Chip
              label={user?.role || 'PORTAL'}
              size="small"
              sx={{
                mt: 1,
                bgcolor: '#1976d2',
                color: '#fff',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ color: '#1976d2', mr: 2 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                User ID
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a2e' }}>
                {user?.user_id || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ color: '#1976d2', mr: 2 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Tenant ID
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a2e' }}>
                {user?.tenant_id || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Success Message */}
      <Paper
        sx={{
          maxWidth: 500,
          mt: 3,
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(46, 125, 50, 0.1)',
          border: '1px solid #4caf50',
        }}
      >
        <Typography variant="body1" sx={{ color: '#4caf50' }}>
          ✅ You have successfully logged in! This is a protected dashboard page.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
