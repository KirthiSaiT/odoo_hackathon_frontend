import React from 'react';
import AuthSlider from '../components/auth/AuthSlider';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="h-screen w-full flex bg-white overflow-hidden">
            {/* Left Side - Form Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 h-full relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="text-left">
                         {/* Optional Logo */}
                        <div className="mb-8">
                             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                                IQ
                             </div>
                        </div>
                        
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {subtitle}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>

            {/* Right Side - Slider Area */}
            <div className="hidden lg:flex w-1/2 bg-gray-800 border-l border-gray-100 relative overflow-hidden h-full">
                <AuthSlider />
            </div>
        </div>
    );
};

export default AuthLayout;
