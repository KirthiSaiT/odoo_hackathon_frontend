import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { KeyboardArrowRight, Loop } from '@mui/icons-material'; // Import Loop icon
import { useGetOrdersQuery } from '../services/orderApi';

const Orders = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetOrdersQuery();
    const orders = data?.orders || [];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Confirmed': return 'primary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'danger';
            case 'Pending': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="bg-gray-50 font-sans text-gray-900">
            {/* Navbar is already in UserLayout */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Orders</h1>
                    <p className="text-gray-500 mt-2">Track the status of your recent purchases and subscriptions.</p>
                </div>

                {/* Orders Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order History
                        </h2>
                        <div className="flex items-center gap-2">
                             {/* Force refresh button for user verification */}
                             {/* <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                                Reload Page
                             </Button> */}
                            {isLoading && <Loop className="animate-spin text-primary" fontSize="small" />}
                        </div>
                    </div>

                    {!isLoading && orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                        <TableHead className="w-[150px]">Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        {/* <TableHead className="text-right">Action</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            // onClick={() => handleOrderClick(order.id)}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <TableCell className="font-medium text-primary">
                                                {order.id}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {order.created_at}
                                            </TableCell>
                                            <TableCell className="font-semibold text-gray-900">
                                                ${order.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.status)} className="capitalize">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            {/* <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <KeyboardArrowRight className="text-gray-400" />
                                                </Button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : !isLoading && (
                        <div className="px-8 py-24 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                <KeyboardArrowRight style={{ fontSize: 48, transform: 'rotate(90deg)' }} /> 
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                            <p className="text-gray-500 mt-1">You haven't placed any orders yet.</p>
                            <div className="mt-6">
                                <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                            </div>
                        </div>
                    )}

                    {/* Footer / Pagination */}
                    {orders.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                            <p className="text-sm text-gray-500">
                                Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
