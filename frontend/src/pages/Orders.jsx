import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Orders = () => {
    const navigate = useNavigate();

    // Mock orders data - replace with actual API data
    const orders = [
        { id: 'SO001', date: '06/02/2026', amount: 1200 },
        { id: 'SO002', date: '06/02/2026', amount: 1800 },
        { id: 'SO003', date: '05/02/2026', amount: 950 },
        { id: 'SO004', date: '04/02/2026', amount: 2300 },
        { id: 'SO005', date: '03/02/2026', amount: 1450 },
    ];

    const handleOrderClick = (orderId) => {
        navigate(`/order-details/${orderId}`);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Page Title */}
                <h1 className="text-4xl font-semibold text-gray-800 mb-8">
                    My Orders
                </h1>

                {/* Orders Table Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 px-8 py-6 border-b border-cyan-200">
                        <h2 className="text-2xl font-semibold text-cyan-700">
                            Order History
                        </h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            {/* Table Header */}
                            <thead className="bg-cyan-50 border-b-2 border-cyan-200">
                                <tr>
                                    <th className="px-8 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wide">
                                        Order ID
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wide">
                                        Order Date
                                    </th>
                                    <th className="px-8 py-4 text-left text-sm font-semibold text-cyan-700 uppercase tracking-wide">
                                        Total Amount
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-cyan-50 transition-colors duration-150"
                                    >
                                        <td className="px-8 py-4">
                                            <button
                                                onClick={() => handleOrderClick(order.id)}
                                                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline focus:outline-none focus:underline"
                                            >
                                                {order.id}
                                            </button>
                                        </td>
                                        <td className="px-8 py-4 text-gray-700">
                                            {order.date}
                                        </td>
                                        <td className="px-8 py-4 text-gray-700 font-medium">
                                            ${order.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State (if no orders) */}
                    {orders.length === 0 && (
                        <div className="px-8 py-16 text-center">
                            <p className="text-gray-500 text-lg">
                                No orders found
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Your order history will appear here
                            </p>
                        </div>
                    )}

                    {/* Table Footer */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
