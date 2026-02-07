import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from './ui/dropdown-menu';
import logo from '../assets/odoo_logo.png';


const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null);
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear any auth tokens/data
        localStorage.removeItem('token');
        sessionStorage.clear();
        // Navigate to login
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
        }, 300); // 300ms delay before closing
        setCloseTimeout(timeout);
    };

    return (
        <nav className="w-full border-2 border-primary bg-background-paper">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Company Logo and Navigation Links */}
                    <div className="flex items-center space-x-8">
                        <div
                            className="cursor-pointer"
                            onClick={() => navigate('/home')}
                        >
                            <img src={logo} alt="Company Logo" className="h-10 w-auto" />
                        </div>

                        <span
                            onClick={() => navigate('/home')}
                            className="text-text-primary font-medium hover:text-primary transition-colors cursor-pointer"
                        >
                            Home
                        </span>
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
                                <Button
                                    variant="outline"
                                    size="default"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    My Profile
                                </Button>
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
