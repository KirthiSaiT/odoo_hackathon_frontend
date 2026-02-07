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
