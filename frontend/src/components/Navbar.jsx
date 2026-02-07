import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from './ui/dropdown-menu';

const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Clear any auth tokens/data
        localStorage.removeItem('token');
        sessionStorage.clear();
        // Navigate to login
        navigate('/login');
    };

    return (
        <nav className="w-full border-2 border-primary bg-background-paper">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Company Logo */}
                    <div className="flex items-center">
                        <div className="border-2 border-primary rounded-lg px-6 py-3">
                            <span className="text-primary font-medium text-lg">Company Logo</span>
                        </div>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="flex items-center space-x-8">
                        <a
                            href="/home"
                            className="text-text-primary font-medium hover:text-primary transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="/shop"
                            className="text-text-primary font-medium hover:text-primary transition-colors"
                        >
                            Shop
                        </a>
                        <a
                            href="/my-account"
                            className="text-text-primary font-medium hover:text-primary transition-colors"
                        >
                            My Account
                        </a>
                    </div>

                    {/* Right: Cart and Profile */}
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="default">
                            Cart
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    My Profile
                                </Button>
                            </DropdownMenuTrigger>

                            {isProfileOpen && (
                                <DropdownMenuContent>
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
