import * as React from 'react';
import { cn } from '../../lib/utils';

const DropdownMenu = ({ children }) => {
    return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef(({ children, onClick, ...props }, ref) => {
    return (
        <div ref={ref} onClick={onClick} {...props}>
            {children}
        </div>
    );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

const DropdownMenuContent = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'absolute right-0 mt-2 w-48 rounded-lg border-2 border-primary bg-background-paper shadow-lg z-50',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'px-4 py-2 text-sm text-text-primary cursor-pointer hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
