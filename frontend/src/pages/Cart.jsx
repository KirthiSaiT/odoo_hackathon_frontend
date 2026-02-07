import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
        <div className="min-h-screen bg-background text-text-primary font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Order Steps Header */}
                <div className="flex gap-8 mb-12 border-b border-primary/30 pb-4 font-handwritten text-xl">
                    <span className="text-primary border-b-2 border-primary pb-4 -mb-4.5 cursor-pointer">Order</span>
                    <span className="text-text-secondary cursor-pointer hover:text-primary transition-colors">Address</span>
                    <span className="text-text-secondary cursor-pointer hover:text-primary transition-colors">Payment</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Cart Items */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-6 items-start">
                                {/* Image Placeholder */}
                                <div className="w-24 h-24 border-2 border-primary rounded-lg flex items-center justify-center bg-background-paper flex-shrink-0">
                                    {item.image ? (
                                        <span className="text-xs text-text-secondary">{item.image}</span>
                                    ) : (
                                        <div className="w-full h-full bg-primary/10"></div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="col-span-1">
                                        <h3 className={`font-handwritten text-xl ${item.isDiscount ? 'text-primary' : ''}`}>
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="text-white text-xs bg-black/50 hover:bg-black/70 px-2 py-0.5 mt-2 rounded flex items-center gap-1 w-fit"
                                        >
                                            <span className="font-sans">Remove</span>
                                        </button>
                                    </div>

                                    {!item.isDiscount ? (
                                        <>
                                            <div className="text-sm font-medium">
                                                {item.price} r.s {item.period}
                                            </div>
                                            <div>
                                                <div className="flex items-center border border-primary rounded-full px-2 w-24 justify-between bg-black text-white">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        className="px-2 hover:text-primary"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        className="px-2 hover:text-primary"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-2 text-sm font-medium">
                                            {item.price} rs
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="border-2 border-primary rounded-lg p-6 bg-background-paper">
                            <div className="space-y-4 mb-6 text-sm lg:text-base">
                                <div className="flex justify-between font-handwritten text-lg">
                                    <span>Subtotal</span>
                                    <span>{subtotal}</span>
                                </div>
                                <div className="flex justify-between font-handwritten text-lg">
                                    <span>Taxes</span>
                                    <span>{taxes}</span>
                                </div>
                                <div className="border-t border-primary/30 my-2"></div>
                                <div className="flex justify-between font-handwritten text-xl font-bold">
                                    <span>Total</span>
                                    <span>{total}</span>
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="mb-4">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Discount code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 bg-black border border-primary rounded px-3 py-2 text-sm text-white placeholder-gray-400 outline-none"
                                    />
                                    <button className="text-primary border border-primary rounded px-4 py-2 text-sm hover:bg-primary/10 transition-colors">
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <div className="border border-primary rounded p-2 text-center text-xs text-primary bg-primary/5">
                                        You have successfully applied
                                    </div>
                                )}
                            </div>

                            {/* Checkout Button */}
                            <Button
                                fullWidth
                                className="h-12 text-lg font-handwritten bg-black hover:bg-black/90 text-primary border border-primary rounded"
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
