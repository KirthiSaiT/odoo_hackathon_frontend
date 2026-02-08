import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';

// Make sure to add VITE_STRIPE_PUBLISHABLE_KEY to .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PaymentModal = ({ isOpen, onClose, clientSecret, paymentIntentId, amount }) => {
    if (!isOpen || !clientSecret) return null;

    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in flex flex-col max-h-[90vh]">
                <div className="p-6 overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Payment</h2>

                    {stripePromise && (
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm
                                clientSecret={clientSecret}
                                paymentIntentId={paymentIntentId}
                                amount={amount}
                                onSuccess={onClose}
                            />
                        </Elements>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
