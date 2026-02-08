import { useEffect } from 'react';
import {
    CheckCircleOutline as SuccessIcon,
    ErrorOutline as ErrorIcon,
    InfoOutline as InfoIcon,
    ReportProblemOutlined as WarningIcon
} from '@mui/icons-material';

const Toast = ({ message, isVisible, type = 'success', onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Increased to 5s for readability
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const getConfig = () => {
        switch (type) {
            case 'error':
                return {
                    icon: <ErrorIcon className="text-red-500" />,
                    border: 'border-red-500',
                    title: 'Error',
                };
            case 'warning':
                return {
                    icon: <WarningIcon className="text-yellow-500" />,
                    border: 'border-yellow-500',
                    title: 'Warning',
                };
            case 'info':
                return {
                    icon: <InfoIcon className="text-blue-500" />,
                    border: 'border-blue-500',
                    title: 'Info',
                };
            default:
                return {
                    icon: <SuccessIcon className="text-primary" />,
                    border: 'border-primary',
                    title: 'Success',
                };
        }
    };

    const config = getConfig();

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
            <div className={`bg-white border-l-4 ${config.border} shadow-lg rounded-r-lg p-4 flex items-center gap-3 min-w-[300px]`}>
                {config.icon}
                <div>
                    <h4 className="font-bold text-gray-800 text-sm">{config.title}</h4>
                    <p className="text-gray-600 text-sm">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default Toast;
