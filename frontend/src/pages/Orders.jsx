import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
import { KeyboardArrowRight } from '@mui/icons-material';

const Orders = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);

    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    // Mock orders data - replace with actual API data
    const orders = [
        { id: 'SO001', date: '06/02/2026', amount: 1200, status: 'Confirmed' },
        { id: 'SO002', date: '06/02/2026', amount: 1800, status: 'Pending' },
        { id: 'SO003', date: '05/02/2026', amount: 950, status: 'Delivered' },
        { id: 'SO004', date: '04/02/2026', amount: 2300, status: 'Cancelled' },
        { id: 'SO005', date: '03/02/2026', amount: 1450, status: 'Confirmed' },
    ];

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
        <div className="min-h-screen bg-gray-50 text-text-primary font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">My Orders</h1>
                    <p className="text-text-secondary mt-2">Track the status of your recent purchases</p>
                </div>

                {/* Orders Table Card */}
                <div className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
                    <div className="px-6 py-4 border-b border-border-light bg-gray-50/50">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Order History
                        </h2>
                    </div>

                    {orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        onClick={() => handleOrderClick(order.id)}
                                        className="cursor-pointer hover:bg-gray-50/50"
                                    >
                                        <TableCell className="font-medium text-primary">
                                            {order.id}
                                        </TableCell>
                                        <TableCell className="text-text-secondary">
                                            {order.date}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${order.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <KeyboardArrowRight className="text-text-secondary" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="px-8 py-16 text-center">
                            <p className="text-text-primary text-lg font-medium">No orders found</p>
                            <p className="text-text-secondary text-sm mt-1">Your order history will appear here</p>
                        </div>
                    )}

                    {/* Footer / Pagination */}
                    <div className="px-6 py-4 border-t border-border-light bg-gray-50/50">
                        <p className="text-sm text-text-secondary">
                            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
