import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { DeleteOutline, Add, Remove } from '@mui/icons-material';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Premium Headphones", price: 1200, period: "per day", quantity: 1, image: "image" },
        // Mocking a discount item as a row
        { id: 'discount', name: "10% on your order", price: -120, period: "rs", quantity: null, isDiscount: true, image: "" }
    ]);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(true); // Mocking pre-applied state for demo

    const handleRemove = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
            }
            return item;
        }));
    };

    // Calculate totals (mock logic)
    const subtotal = 1080;
    const taxes = 120;
    const total = 1200;

    return (
        <div className="min-h-screen bg-gray-50 text-text-primary font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-text-primary">Shopping Cart</h1>
                    <p className="text-text-secondary mt-1">Review your items and proceed to checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Cart Items */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className={`bg-white rounded-lg shadow-sm border border-border-light p-4 flex gap-4 items-start ${item.isDiscount ? 'bg-green-50 border-green-200' : ''}`}>
                                {/* Image Placeholder */}
                                <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 border border-border-light">
                                    {item.image ? (
                                        <span className="text-xs text-text-secondary font-medium">{item.image}</span>
                                    ) : (
                                        <div className="w-full h-full bg-primary/10"></div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="col-span-1">
                                        <h3 className={`font-semibold text-lg ${item.isDiscount ? 'text-green-700' : 'text-text-primary'}`}>
                                            {item.name}
                                        </h3>
                                        {!item.isDiscount && (
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-red-500 text-sm hover:text-red-700 flex items-center gap-1 mt-1 transition-colors"
                                            >
                                                <DeleteOutline style={{ fontSize: 16 }} />
                                                <span>Remove</span>
                                            </button>
                                        )}
                                    </div>

                                    {!item.isDiscount ? (
                                        <>
                                            <div className="text-sm font-medium text-text-secondary">
                                                {item.price} r.s {item.period}
                                            </div>
                                            <div className="flex justify-start md:justify-end">
                                                <div className="flex items-center border border-border-light rounded-lg bg-white">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        className="px-3 py-1 hover:bg-gray-50 text-text-secondary transition-colors border-r border-border-light"
                                                    >
                                                        <Remove style={{ fontSize: 14 }} />
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium text-text-primary min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        className="px-3 py-1 hover:bg-gray-50 text-text-secondary transition-colors border-l border-border-light"
                                                    >
                                                        <Add style={{ fontSize: 14 }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-2 text-sm font-medium text-green-700 text-right">
                                            {item.price} rs
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-lg shadow-sm border border-border-light p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-text-primary">{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Taxes</span>
                                    <span className="font-medium text-text-primary">{taxes}</span>
                                </div>
                                <div className="border-t border-gray-100 my-2"></div>
                                <div className="flex justify-between text-lg font-bold text-text-primary">
                                    <span>Total</span>
                                    <span>{total}</span>
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Discount Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 rounded-lg border border-border-light px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                    <Button variant="outline" size="sm" className="whitespace-nowrap">
                                        Apply
                                    </Button>
                                </div>
                                {couponApplied && (
                                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        Coupon applied successfully
                                    </p>
                                )}
                            </div>

                            {/* Checkout Button */}
                            <Button fullWidth className="h-11 text-base shadow-sm">
                                Proceed to Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
