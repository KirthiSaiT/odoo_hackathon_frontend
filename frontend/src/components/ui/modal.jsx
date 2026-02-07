// Reusable Modal component with TailwindCSS
import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, className, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full bg-background-paper rounded-lg shadow-xl border border-border-light',
          'animate-in fade-in zoom-in-95 duration-200',
          sizes[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ children, className, onClose, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-border-light',
        className
      )}
      {...props}
    >
      <h2 className="text-lg font-semibold text-text-primary">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-text-secondary" />
        </button>
      )}
    </div>
  );
};

const ModalContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter };
