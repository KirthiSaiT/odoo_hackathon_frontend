import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useGetOrderDetailsQuery } from '../services/orderApi';
import { Loader2, Download, Printer, ArrowLeft, Mail, Phone, Calendar, Hash } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const receiptRef = useRef();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

    const handleExportPDF = () => {
        const element = receiptRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Receipt_#${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600 font-handwritten text-xl">Preparing your receipt...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                    <div className="text-red-500 text-6xl mb-4 font-handwritten">Oops!</div>
                    <p className="text-gray-600 mb-6">We couldn't find that receipt. It might be lost in the kitchen!</p>
                    <Button onClick={() => navigate('/orders')} className="w-full">
                        Back to My Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] text-[#2C3E50] font-sans pb-12 print:bg-white print:pb-0">
            {/* Removed duplicated Navbar as it is in UserLayout */}

            <div className="max-w-4xl mx-auto px-4 py-12 print:py-0 print:px-0 print:max-w-none">
                {/* Action Bar */}
                <div className="flex justify-between items-center mb-10 print:hidden">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">My Orders</span>
                    </button>
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            <Download className="w-4 h-4" /> Export PDF
                        </Button>
                        <Button 
                            size="sm" 
                            onClick={handlePrint} 
                            className="flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> Print Receipt
                        </Button>
                    </div>
                </div>

                {/* The "Paper" Receipt */}
                <div ref={receiptRef} className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden border border-gray-100 flex flex-col print:shadow-none print:border-none print:rounded-none">
                    {/* Top Decorative Bar */}
                    <div className="h-2 bg-gradient-to-r from-primary to-blue-400" />

                    <div className="p-8 sm:p-12">
                        {/* Receipt Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-handwritten text-primary mb-2">Order Receipt</h1>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-gray-500 rounded-full text-sm font-medium">
                                <Hash className="w-3.5 h-3.5" />
                                {order.id}
                            </div>
                        </div>

                        {/* Order & Customer Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-y border-gray-100 py-10">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Customer Details</h3>
                                    <div className="space-y-3">
                                        <div className="text-lg font-semibold text-gray-800">{order?.user?.name || 'Valued Customer'}</div>
                                        <div className="flex items-center gap-3 text-gray-500">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">{order?.user?.email || 'No email provided'}</span>
                                        </div>
                                        {order?.user?.phone && (
                                            <div className="flex items-center gap-3 text-gray-500">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-sm">{order?.user?.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">Order Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-medium">Date: <span className="text-gray-400 ml-1 font-normal">{order.created_at}</span></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            </div>
                                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-0.5 rounded-full uppercase tracking-tighter">
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="mb-12">
                            <h3 className="text-xl font-handwritten text-gray-800 mb-6">Items Ordered</h3>
                            <div className="space-y-1">
                                <div className="grid grid-cols-12 pb-3 border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                    <div className="col-span-6">Description</div>
                                    <div className="col-span-2 text-center">Qty</div>
                                    <div className="col-span-2 text-right">Each</div>
                                    <div className="col-span-2 text-right">Total</div>
                                </div>

                                {order.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 py-5 items-center border-b border-gray-50 last:border-0">
                                        <div className="col-span-6">
                                            <div className="font-semibold text-gray-800">{item.product_name}</div>
                                            {item.plan_name && (
                                                <div className="text-[10px] text-primary uppercase font-bold tracking-tighter mt-1">
                                                    Plan: {item.plan_name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 text-center text-gray-500 text-sm">
                                            {item.quantity}×
                                        </div>
                                        <div className="col-span-2 text-right text-gray-500 text-sm">
                                            ₹{item.price.toLocaleString()}
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-gray-900">
                                            ₹{(item.quantity * item.price).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="bg-gray-50 rounded-2xl p-8 ml-auto max-w-sm">
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{order.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Taxes (Included)</span>
                                    <span className="font-medium">₹0</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Final Amount</span>
                                        <span className="text-primary font-handwritten text-3xl">Grand Total</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900 leading-none">
                                        ₹{order.amount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer message */}
                        <div className="mt-16 text-center border-t border-gray-50 pt-10">
                            <p className="font-handwritten text-2xl text-gray-600 italic">"Thank you for your order!"</p>
                            <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em] mt-3">Digitally Generated Receipt</p>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body {
                        background: white !important;
                    }
                    nav, .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:py-0 {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    .print\\:px-0 {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border-none {
                        border: none !important;
                    }
                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}} />
        </div>
    );
};

export default OrderDetails;
