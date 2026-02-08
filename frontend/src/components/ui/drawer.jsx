import React, { useEffect } from 'react';
import { Button } from './button';
import { ArrowForward } from '@mui/icons-material';

/**
 * Drawer Component
 * Slides in from the right.
 * Positioned to be BELOW the Sidebar (z-20) but ABOVE main content.
 * 
 * @param {boolean} isOpen - Whether the drawer is open
 * @param {function} onClose - Function to close the drawer
 * @param {string} title - Title of the drawer
 * @param {React.ReactNode} children - Drawer content
 * @param {string} width - Custom width (default: 'max-w-2xl')
 * @param {React.ReactNode} footer - Footer content
 */
const Drawer = ({ isOpen, onClose, title, children, width = 'max-w-2xl', footer }) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop - Transparent, click to close. Starts below navbar (top-16) */}
            <div
                className={`fixed inset-x-0 bottom-0 top-16 bg-transparent transition-opacity duration-300 z-30 ${isOpen ? 'block' : 'hidden'}`}
                onClick={onClose}
            />

            {/* Drawer Panel - Starts below navbar (top-16) */}
            <div
                className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col w-full ${width} ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:max-w-[calc(100vw-16rem)]`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0 hover:bg-gray-100/50" title="Back to list">
                        <ArrowForward className="text-text-secondary" />
                    </Button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                    {children}
                </div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};

export default Drawer;
