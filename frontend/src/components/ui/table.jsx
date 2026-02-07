// Reusable Table component with TailwindCSS
import React from 'react';
import { cn } from '../../lib/utils';

const Table = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-light">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={cn('bg-gray-50 border-b border-border-light', className)} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={cn('bg-background-paper divide-y divide-border-light', className)} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, onClick, hoverable = true, ...props }) => {
  return (
    <tr
      className={cn(
        hoverable && 'hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-text-primary uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={cn('px-4 py-3 text-text-primary', className)} {...props}>
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
