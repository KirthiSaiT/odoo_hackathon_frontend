import * as React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        default: 'bg-primary text-white hover:bg-primary-dark',
        outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
        ghost: 'hover:bg-gray-100 text-text-primary',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            ref={ref}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
