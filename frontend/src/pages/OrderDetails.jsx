import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock data based on wireframe
    const order = {
        id: id || 'S0001',
        subscriptionId: 'S00022',
        state: 'State of subscription',
        plan: 'Basic Plan',
        startDate: '01/01/2026',
        endDate: '01/01/2027',
        lastInvoice: {
            number: 'INV/2026/001',
            status: 'payment status'
        },
        address: {
            line1: '123 Main St, Apt 4B',
            line2: 'New York, NY 10001',
            line3: 'United States',
            email: 'john.doe@example.com',
            phone: '+1 555-0123'
        },
        products: [
            { name: "Product Name", quantity: 2.00, unitPrice: 1200, tax: "15%", amount: 2400 },
            { name: "10% on your order", quantity: 1, unitPrice: -120, tax: "", amount: -120, isDiscount: true }
        ],
        financial: {
            untaxed: 2280,
            tax: 360,
            total: 2640
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-handwritten text-text-primary">Order/{order.id}</h1>
                    <div className="flex gap-4">
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Download
                        </Button>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                            Renew
                        </Button>
                        <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/10"
                            onClick={() => navigate('/orders')}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                {/* Main Content Box */}
                <div className="border-2 border-primary rounded-xl p-8 bg-background-paper relative">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        {/* Left Column: Subscription Info */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-xl font-bold">{order.subscriptionId}</h2>
                                <span className="border border-primary rounded-full px-3 py-1 text-xs text-primary">
                                    {order.state}
                                </span>
                            </div>

                            <h3 className="text-lg font-handwritten text-primary border-b border-primary/30 pb-1 mb-4 w-fit">
                                Your Subscription
                            </h3>

                            <div className="space-y-2 mb-8">
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="font-handwritten text-text-secondary">Plan:</span>
                                    <span className="col-span-2 border-b border-text-secondary/30">{order.plan}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="font-handwritten text-text-secondary">Start Date:</span>
                                    <span className="col-span-2 border-b border-text-secondary/30">{order.startDate}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="font-handwritten text-text-secondary">End Date:</span>
                                    <span className="col-span-2 border-b border-text-secondary/30">{order.endDate}</span>
                                </div>
                            </div>

                            <h3 className="text-lg font-handwritten text-primary border-b border-primary/30 pb-1 mb-4 w-fit">
                                Last Invoices
                            </h3>
                            <div className="flex items-center gap-8">
                                <span className="border-b border-text-secondary/30">{order.lastInvoice.number}</span>
                                <span className="border border-primary rounded-full px-3 py-0.5 text-xs text-primary">
                                    {order.lastInvoice.status}
                                </span>
                            </div>
                        </div>

                        {/* Right Column: Address */}
                        <div>
                            <h3 className="text-lg font-handwritten text-primary border-b border-primary/30 pb-1 mb-4 w-fit">
                                Invoicing and Shipping Address
                            </h3>

                            <div className="space-y-1 mb-6 text-sm">
                                <p className="border-b border-text-secondary/30 w-fit pb-1">{order.address.line1}</p>
                                <p className="border-b border-text-secondary/30 w-fit pb-1">{order.address.line2}</p>
                                <p className="border-b border-text-secondary/30 w-fit pb-1">{order.address.line3}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="font-handwritten text-text-secondary">Email:</span>
                                    <span className="col-span-2 border-b border-text-secondary/30">{order.address.email}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <span className="font-handwritten text-text-secondary">Phone Number:</span>
                                    <span className="col-span-2 border-b border-text-secondary/30">{order.address.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="mb-8">
                        <h3 className="text-xl font-handwritten text-primary mb-4">Products</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-primary text-sm font-handwritten text-text-secondary">
                                    <th className="py-2 font-normal">Product Name</th>
                                    <th className="py-2 font-normal text-center">Quantity</th>
                                    <th className="py-2 font-normal text-right">Unit Price</th>
                                    <th className="py-2 font-normal text-right">Taxes</th>
                                    <th className="py-2 font-normal text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products.map((product, index) => (
                                    <tr key={index} className="border-b border-primary/20 text-sm">
                                        <td className={`py-3 ${product.isDiscount ? 'text-primary italic' : ''}`}>
                                            {product.name}
                                        </td>
                                        <td className="py-3 text-center">
                                            {product.quantity} {!product.isDiscount && 'Unit'}
                                        </td>
                                        <td className="py-3 text-right">
                                            {product.unitPrice} {product.isDiscount ? 'rs' : 'Rs'}
                                        </td>
                                        <td className="py-3 text-right">{product.tax}</td>
                                        <td className="py-3 text-right font-medium">
                                            {product.amount}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm font-handwritten">
                                <span>Untaxed Amount</span>
                                <span>{order.financial.untaxed}</span>
                            </div>
                            <div className="flex justify-between text-sm font-handwritten border-b border-primary/30 pb-2">
                                <span>Tax 15%</span>
                                <span>{order.financial.tax}</span>
                            </div>
                            <div className="flex justify-between text-lg font-handwritten font-bold pt-2">
                                <span>Total</span>
                                <span>{order.financial.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
