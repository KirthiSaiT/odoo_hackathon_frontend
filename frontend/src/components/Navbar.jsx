import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/authSlice';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from './ui/dropdown-menu';
import {
    Home,
    People,
    Security,
    Business,
    Settings,
    Logout,
    AdminPanelSettings,
    Menu,
} from '@mui/icons-material';
import logo from '../assets/odoo_logo.png';

const Navbar = ({ showLogo = true, onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    
    // Check if user is admin
    const isAdmin = user?.role === 'ADMIN' || user?.role_id === 1;

    const handleSignOut = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        sessionStorage.clear();
        navigate('/login');
    };

    const handleUserDetails = () => {
        navigate('/user-details');
        setIsProfileOpen(false);
    };

    const handleOrders = () => {
        navigate('/orders');
        setIsProfileOpen(false);
    };

    const handleMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setIsProfileOpen(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsProfileOpen(false);
        }, 300);
        setCloseTimeout(timeout);
    };

    const adminLinks = [
        { label: 'Users', path: '/admin/users', icon: People },
        { label: 'Employees', path: '/admin/employees', icon: Business },
        { label: 'Roles', path: '/admin/roles', icon: Security },
        { label: 'Role Rights', path: '/admin/role-rights', icon: Settings },
    ];

    return (
        <nav className="w-full border-b border-border-light bg-background-paper shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Logo or Menu Toggle */}
                    <div className="flex items-center gap-4">
                        {onMenuClick && (
                            <button 
                                onClick={onMenuClick}
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-600"
                            >
                                <Menu style={{ fontSize: 24 }} />
                            </button>
                        )}
                        
                        {showLogo && (
                            <div
                                className="cursor-pointer"
                                onClick={() => navigate('/home')}
                            >
                                <img src={logo} alt="Company Logo" className="h-10 w-auto" />
                            </div>
                        )}
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/home"
                            className="flex items-center gap-1.5 text-text-primary font-medium hover:text-primary transition-colors"
                        >
                            <Home style={{ fontSize: 18 }} />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <span
                            onClick={() => navigate('/shop')}
                            className="text-text-primary font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                            Shop
                        </span>
                    </div>

                    {/* Right: Cart and Profile */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={() => navigate('/cart')}
                        >
                            Cart
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-medium text-sm">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-medium text-text-primary">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            {user?.role || 'User'}
                                        </p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>

                            {isProfileOpen && (
                                <DropdownMenuContent
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <DropdownMenuItem onClick={handleUserDetails}>
                                        User details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleOrders}>
                                        Orders
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <Logout style={{ fontSize: 16, marginRight: 8 }} />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
