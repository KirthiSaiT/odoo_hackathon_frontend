import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Toast = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
            <div className="bg-white border-l-4 border-primary shadow-lg rounded-r-lg p-4 flex items-center gap-3 min-w-[300px]">
                <CheckCircleOutlineIcon className="text-primary" />
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">Success</h4>
                    <p className="text-gray-600 text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default Toast;
