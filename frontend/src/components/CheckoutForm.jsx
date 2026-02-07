import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useConfirmPaymentMutation } from '../services/paymentApi';
import { useCreateOrderMutation } from '../services/orderApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice'; // Assuming you have a clearCart action

const CheckoutForm = ({ clientSecret, paymentIntentId, amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [confirmPayment] = useConfirmPaymentMutation();
    const [createOrder] = useCreateOrderMutation();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL is required for some payment methods, but we handle logic here if redirect doesn't happen
                return_url: window.location.origin + '/cart',
            },
            redirect: 'if_required',
        });

        if (error) {
            toast.error(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                // 1. Confirm with backend (update status in DB)
                await confirmPayment(paymentIntent.id).unwrap();

                // 2. Create Order
                // Note: Ideally, the order is created first or linked. 
                // Based on user request "add order id with this", logic might need adjustment.
                // For now, we assume success -> create order.
                const order = await createOrder({
                    paymentIntentId: paymentIntent.id
                }).unwrap();

                toast.success('Payment successful! Order placed.');

                // 3. Clear Cart (using API or Redux)
                // If API clears cart on order creation, this might be redundant but safe.
                // dispatch(clearCart()); 

                onSuccess(); // Close modal

                // Redirect to Order Details
                navigate(`/orders/${order.id}`);

            } catch (err) {
                console.error("Post-payment error:", err);
                toast.error('Payment succeeded but order creation failed. Please contact support.');
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.info(`Payment status: ${paymentIntent.status}`);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Mode Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Test Mode Active:</strong> Use the following card for a successful payment:
                        </p>
                        <p className="text-sm font-mono mt-1 text-blue-800 bg-blue-100 p-1 rounded inline-block select-all">
                            4242 4242 4242 4242
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            (Expiry: Any future date, CVC: Any 3 digits, ZIP: Any)
                        </p>
                    </div>
                </div>
            </div>

            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
                {isLoading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
        </form>
    );
};

export default CheckoutForm;
