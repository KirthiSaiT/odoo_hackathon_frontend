import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from '../services/cartApi';
import { useCreatePaymentIntentMutation } from '../services/paymentApi';
import Toast from '../components/ui/Toast';
import PaymentModal from '../components/PaymentModal';

const Cart = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const { data: cartData, isLoading, isError } = useGetCartQuery();
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();
    const [clearCart] = useClearCartMutation();
    const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreatePaymentIntentMutation();

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');

    const handleQuantityChange = async (itemId, currentQuantity, delta) => {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;

        try {
            await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap();
        } catch (error) {
            console.error('Failed to update quantity:', error);
            setToastMessage('Failed to update quantity');
            setShowToast(true);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await removeFromCart(itemId).unwrap();
            setToastMessage('Item removed from cart');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to remove item:', error);
            setToastMessage('Failed to remove item');
            setShowToast(true);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your cart?')) return;

        try {
            await clearCart().unwrap();
            setToastMessage('Cart cleared');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to clear cart:', error);
            setToastMessage('Failed to clear cart');
            setShowToast(true);
        }
    };

    const handleCheckout = async () => {
        if (!cartData || cartData.items.length === 0) return;

        try {
            const response = await createPaymentIntent({
                amount: cartData.total,
                currency: 'INR',
                metadata: {
                    source: "web_cart"
                }
            }).unwrap();

            setClientSecret(response.client_secret);
            setPaymentIntentId(response.payment_intent_id);
            setIsPaymentModalOpen(true);

        } catch (error) {
            console.error("Failed to create payment intent:", error);
            const errorMessage = error?.data?.detail || error?.message || 'Failed to initialize payment. Please try again.';
            setToastMessage(`Error: ${errorMessage}`);
            setShowToast(true);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="text-center py-20">Loading cart...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="text-center py-20 text-red-500">Failed to load cart. Please try again.</div>
            </div>
        );
    }

    const cart = cartData || { items: [], total_items: 0, subtotal: 0, tax_amount: 0, total: 0 };

    return (
        <div className="min-h-screen bg-gray-50 text-text-primary font-sans">


            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary">Shopping Cart</h1>
                    {cart.items.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={handleClearCart}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                        >
                            Clear Cart
                        </Button>
                    )}
                </div>

                {cart.items.length === 0 ? (
                    /* Empty Cart State */
                    <div className="bg-white rounded-lg shadow-sm border border-border-light p-12 text-center">
                        <ShoppingCart className="mx-auto mb-4 text-gray-300" style={{ fontSize: 80 }} />
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
                        <p className="text-text-secondary mb-6">Add some products to get started!</p>
                        <Button onClick={() => navigate('/shop')}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    /* Cart Items */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-border-light p-4 flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full ${item.product_image ? 'hidden' : 'flex'} items-center justify-center text-gray-400 font-medium`}>
                                            {item.product_name.charAt(0)}
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-text-primary mb-1">{item.product_name}</h3>
                                        <p className="text-sm text-text-secondary mb-2">{item.product_type}</p>
                                        {item.selected_plan_name && (
                                            <p className="text-xs text-primary font-medium">Plan: {item.selected_plan_name}</p>
                                        )}
                                        <p className="text-lg font-bold text-primary mt-2">${item.sales_price.toFixed(2)}</p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Delete />
                                        </button>

                                        <div className="flex items-center gap-2 border-2 border-primary rounded-full px-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors"
                                            >
                                                <Remove />
                                            </button>
                                            <span className="font-medium text-lg w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                className="w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors"
                                            >
                                                <Add />
                                            </button>
                                        </div>

                                        <p className="text-sm font-semibold text-text-primary">
                                            ${item.item_total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-border-light p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-text-primary mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal ({cart.total_items} items)</span>
                                        <span>${cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Tax</span>
                                        <span>${cart.tax_amount.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-text-primary">
                                        <span>Total</span>
                                        <span className="text-primary">${cart.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mb-3"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={isCreatingIntent}
                                >
                                    {isCreatingIntent ? 'Processing...' : 'Proceed to Checkout'}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/shop')}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                amount={cart?.total}
            />
        </div>
    );
};

export default Cart;
