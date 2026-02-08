import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Drawer from '../../components/ui/drawer';
import {
    Add,
    Delete,
    Search,
    Save,
    Send,
    CheckCircle,
} from '@mui/icons-material';
import {
    useGetSubscriptionsQuery,
    useCreateSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} from '../../services/subscriptionsApi';
import { useGetProductsQuery } from '../../services/productsApi';
import { useGetClientsQuery } from '../../services/clientApi';

import { useToast } from '../../components/ToastProvider';

const Subscriptions = () => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('order_lines'); // 'order_lines' or 'other_info'

    // Form state
    const [formData, setFormData] = useState({
        customer_id: '',
        quotation_template: '',
        expiration_date: '',
        order_date: new Date().toISOString().split('T')[0],
        recurring_plan: 'Monthly',
        payment_term: '',
        next_invoice_date: '',
        status: 'Quotation',
    });

    // Order Lines state
    const [orderLines, setOrderLines] = useState([
        { product_id: null, product_name: '', quantity: 1, unit_price: 0, discount: 0, taxes: 0, amount: 0 }
    ]);

    // Other Info state
    const [otherInfo, setOtherInfo] = useState({
        salesperson: '',
        start_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        payment_done: false,
    });

    // API Hooks
    const { data: clientsList } = useGetClientsQuery({ page: 1, size: 100 });
    const { data: subscriptionsData, isLoading, isError } = useGetSubscriptionsQuery({
        page,
        size: 10,
        search: searchTerm,
    });
    const { data: productsData } = useGetProductsQuery({ page: 1, size: 100 });
    const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
    const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();
    const [deleteSubscription] = useDeleteSubscriptionMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOtherInfoChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOtherInfo((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddOrderLine = () => {
        setOrderLines([...orderLines, { product_id: null, product_name: '', quantity: 1, unit_price: 0, discount: 0, taxes: 0, amount: 0 }]);
    };

    const handleRemoveOrderLine = (index) => {
        setOrderLines(orderLines.filter((_, i) => i !== index));
    };

    const handleOrderLineChange = (index, field, value) => {
        const newLines = [...orderLines];
        newLines[index][field] = value;

        // Calculate amount
        if (field === 'quantity' || field === 'unit_price' || field === 'discount' || field === 'taxes') {
            const qty = parseFloat(newLines[index].quantity) || 0;
            const price = parseFloat(newLines[index].unit_price) || 0;
            const discount = parseFloat(newLines[index].discount) || 0;
            const taxes = parseFloat(newLines[index].taxes) || 0;

            const subtotal = qty * price;
            const afterDiscount = subtotal - (subtotal * discount / 100);
            newLines[index].amount = afterDiscount + (afterDiscount * taxes / 100);
        }

        // If product selected, auto-fill price
        if (field === 'product_id' && value) {
            const product = productsData?.items?.find(p => p.id === parseInt(value));
            if (product) {
                newLines[index].product_name = product.name;
                newLines[index].unit_price = product.sales_price || 0;
                newLines[index].amount = newLines[index].quantity * (product.sales_price || 0);
            }
        }

        setOrderLines(newLines);
    };

    const handleOpenDrawer = (subscription = null) => {
        if (subscription) {
            setSelectedSubscription(subscription);
            setFormData({
                customer_id: subscription.customer_id,
                quotation_template: subscription.quotation_template || '',
                expiration_date: subscription.expiration_date,
                order_date: subscription.start_date,
                recurring_plan: subscription.recurring_plan,
                payment_term: subscription.payment_term || '',
                next_invoice_date: subscription.next_invoice_date,
                status: subscription.status,
            });
            // Note: In a real app, you'd fetch order lines and other info for the specific subscription
        } else {
            setSelectedSubscription(null);
            setFormData({
                customer_id: '',
                quotation_template: '',
                expiration_date: '',
                order_date: new Date().toISOString().split('T')[0],
                recurring_plan: 'Monthly',
                payment_term: '',
                next_invoice_date: '',
                status: 'Quotation',
            });
            setOrderLines([{ product_id: null, product_name: '', quantity: 1, unit_price: 0, discount: 0, taxes: 0, amount: 0 }]);
            setOtherInfo({
                salesperson: '',
                start_date: new Date().toISOString().split('T')[0],
                payment_method: '',
                payment_done: false,
            });
        }
        setIsDrawerOpen(true);
        setActiveTab('order_lines');
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedSubscription(null);
    };

    const calculateTotalAmount = () => {
        return orderLines.reduce((sum, line) => sum + (line.amount || 0), 0);
    };

    const handleSave = async () => {
        try {
            const totalPrice = calculateTotalAmount();
            const payload = {
                customer_id: formData.customer_id,
                quotation_template: formData.quotation_template || null,
                expiration_date: formData.expiration_date,
                recurring_plan: formData.recurring_plan,
                payment_term: formData.payment_term || null,
                total_price: totalPrice,
                salesperson: otherInfo.salesperson || null,
                start_date: otherInfo.start_date,
                order_date: formData.order_date || null,
                next_invoice_date: formData.next_invoice_date || null,
                payment_method: otherInfo.payment_method || null,
                payment_done: otherInfo.payment_done,
                status: formData.status,
                order_lines: orderLines.map(line => ({
                    ...line,
                    product_id: line.product_id ? parseInt(line.product_id) : null,
                    quantity: parseInt(line.quantity) || 0,
                    unit_price: parseFloat(line.unit_price) || 0,
                    discount: parseFloat(line.discount) || 0,
                    taxes: parseFloat(line.taxes) || 0,
                    amount: parseFloat(line.amount) || 0
                })),
            };

            if (selectedSubscription) {
                await updateSubscription({ id: selectedSubscription.id, ...payload }).unwrap();
                toast.success('Subscription updated successfully!');
            } else {
                await createSubscription(payload).unwrap();
                toast.success('Subscription created successfully!');
            }

            handleCloseDrawer();
        } catch (error) {
            console.error('Error saving subscription:', error);
            toast.error('Failed to save subscription. Please try again.');
        }
    };

    const handleSendQuotation = async () => {
        setFormData(prev => ({ ...prev, status: 'QuotationSent' }));
        toast.success('Quotation status updated to Sent!');
    };

    const handleConfirm = async () => {
        setFormData(prev => ({ ...prev, status: 'Confirmed' }));
        toast.success('Subscription confirmed!');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            try {
                await deleteSubscription(id).unwrap();
                toast.success('Subscription deleted successfully!');
            } catch (error) {
                console.error('Error deleting subscription:', error);
                toast.error('Failed to delete subscription.');
            }
        }
    };

    const subscriptions = subscriptionsData?.items || [];

    const getStatusColor = (status, isActive) => {
        if (isActive) {
            switch (status) {
                case 'Quotation': return 'bg-yellow-500 text-white';
                case 'QuotationSent': return 'bg-blue-500 text-white';
                case 'Confirmed': return 'bg-green-500 text-white';
                default: return 'bg-gray-500 text-white';
            }
        }
        switch (status) {
            case 'Quotation': return 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100';
            case 'QuotationSent': return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
            case 'Confirmed': return 'bg-green-50 text-green-600 hover:bg-green-100';
            case 'Churned': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    const usersList = ['this_variable_is_no_longer_used']; // placeholder ensuring no undefined error if I missed a ref

    return (
        <div className="p-6 bg-background min-h-screen">
            {/* ... header ... */ }
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Subscriptions</h1>
                <p className="text-text-secondary mt-1">
                    Manage customer subscriptions and recurring billing
                </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-border-light">
                <div className="flex items-center gap-3">
                    <Button onClick={() => handleOpenDrawer()}>
                        <Add className="mr-1" style={{ fontSize: 18 }} />
                        New
                    </Button>

                    <div className="h-8 w-px bg-border-light mx-1"></div>
                    <button
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors rounded hover:bg-red-50"
                        title="Delete"
                    >
                        <Delete style={{ fontSize: 20 }} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
                    <Input
                        type="text"
                        placeholder="Search subscriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow border border-border-light min-h-[500px] p-6 mt-6">
                {isLoading ? (
                    <div className="text-center p-10 text-gray-500">Loading subscriptions...</div>
                ) : isError ? (
                    <div className="text-center p-10 text-red-500">Error loading subscriptions.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Next Invoice</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                        No subscriptions found. Click "New" to create one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                subscriptions.map((subscription) => (
                                    <TableRow
                                        key={subscription.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleOpenDrawer(subscription)}
                                    >
                                        <TableCell className="font-medium">{subscription.subscription_number}</TableCell>
                                        <TableCell>{subscription.customer_name}</TableCell>
                                        <TableCell>{subscription.next_invoice_date ? new Date(subscription.next_invoice_date).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell>${subscription.total_price?.toFixed(2) || '0.00'}</TableCell>
                                        <TableCell>{subscription.recurring_plan}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status, false)}`}>
                                                {subscription.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(subscription.id);
                                                }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Delete style={{ fontSize: 18 }} />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Subscription Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={selectedSubscription ? `${selectedSubscription.subscription_number}` : 'New Subscription'}
                width="max-w-5xl"
                footer={
                    <div className="flex items-center justify-between w-full">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCloseDrawer}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
                                <Save className="mr-1" style={{ fontSize: 18 }} />
                                {isCreating || isUpdating ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleSendQuotation}>
                                <Send className="mr-1" style={{ fontSize: 18 }} />
                                Send
                            </Button>
                            <Button variant="outline" onClick={handleConfirm}>
                                <CheckCircle className="mr-1" style={{ fontSize: 18 }} />
                                Confirm
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="py-2">
                    {/* Status Header */}
                    <div className="mb-4 flex items-center justify-between border-b border-border-light pb-3">
                        <div className="flex gap-2">
                            {/* Send Button: Visible in Quotation */}
                            {(formData.status === 'Quotation') && (
                                <Button variant="outline" size="sm" onClick={handleSendQuotation}>
                                    <Send className="mr-1" style={{ fontSize: 16 }} />
                                    Send
                                </Button>
                            )}

                            {/* Confirm Button: Visible in Quotation and QuotationSent */}
                            {(formData.status === 'Quotation' || formData.status === 'QuotationSent') && (
                                <Button variant="outline" size="sm" onClick={handleConfirm}>
                                    <CheckCircle className="mr-1" style={{ fontSize: 16 }} />
                                    Confirm
                                </Button>
                            )}

                            {/* Preview Button: Visible in QuotationSent and Confirmed */}
                            {(formData.status === 'QuotationSent' || formData.status === 'Confirmed') && (
                                <Button variant="outline" size="sm">
                                    Preview
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${getStatusColor('Quotation', formData.status === 'Quotation')}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'Quotation' }))}
                            >
                                Quotation
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${getStatusColor('QuotationSent', formData.status === 'QuotationSent')}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'QuotationSent' }))}
                            >
                                quotation sent
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${getStatusColor('Confirmed', formData.status === 'Confirmed')}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'Confirmed' }))}
                            >
                                confirmed
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons Row 2: Only Visible in Confirmed State */}
                    {
                        formData.status === 'Confirmed' && (
                            <div className="mb-6 flex gap-2 border-b border-border-light pb-3">
                                <Button variant="outline" size="sm">
                                    Create Invoice
                                </Button>
                                <Button variant="outline" size="sm">
                                    Cancel
                                </Button>
                                <Button variant="outline" size="sm">
                                    Renew
                                </Button>
                                <Button variant="outline" size="sm">
                                    Upsell
                                </Button>
                                <Button variant="outline" size="sm">
                                    Close
                                </Button>
                            </div>
                        )
                    }

                    {/* Main Form Fields - Always Visible (Read-only logic can be added if needed) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Subscription Number
                                </label>
                                <input
                                    type="text"
                                    value={selectedSubscription?.subscription_number || 'Auto-generated'}
                                    disabled
                                    className="w-full p-2 border-b border-border-light bg-gray-50 outline-none text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Customer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="customer_id"
                                    value={formData.customer_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    required
                                >
                                    <option value="">-- Select Customer --</option>
                                    {clientsList?.items?.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.client_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Quotation Template
                                </label>
                                <input
                                    type="text"
                                    name="quotation_template"
                                    value={formData.quotation_template}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="Template name"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Expiration <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="expiration_date"
                                    value={formData.expiration_date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Order Date
                                </label>
                                <input
                                    type="date"
                                    name="order_date"
                                    value={formData.order_date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Recurring Plan <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="recurring_plan"
                                    value={formData.recurring_plan}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                    <option value="Quarterly">Quarterly</option>
                                    <option value="Weekly">Weekly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Payment Term
                                </label>
                                <input
                                    type="text"
                                    name="payment_term"
                                    value={formData.payment_term}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="e.g., Net 30"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Next Invoice
                                </label>
                                <input
                                    type="date"
                                    name="next_invoice_date"
                                    value={formData.next_invoice_date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="flex gap-4 border-b border-border-light">
                            <button
                                className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'order_lines'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }`}
                                onClick={() => setActiveTab('order_lines')}
                            >
                                Order Lines
                            </button>
                            <button
                                className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'other_info'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }`}
                                onClick={() => setActiveTab('other_info')}
                            >
                                Other Info
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {
                        activeTab === 'order_lines' && (
                            <div className="border border-border-light rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Discount (%)</TableHead>
                                            <TableHead>Taxes (%)</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="w-[50px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderLines.map((line, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <select
                                                        value={line.product_id || ''}
                                                        onChange={(e) => handleOrderLineChange(index, 'product_id', e.target.value)}
                                                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary"
                                                    >
                                                        <option value="">-- Select Product --</option>
                                                        {productsData?.items?.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="number"
                                                        value={line.quantity}
                                                        onChange={(e) => handleOrderLineChange(index, 'quantity', e.target.value)}
                                                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary"
                                                        min="1"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="number"
                                                        value={line.unit_price}
                                                        onChange={(e) => handleOrderLineChange(index, 'unit_price', e.target.value)}
                                                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary"
                                                        step="0.01"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="number"
                                                        value={line.discount}
                                                        onChange={(e) => handleOrderLineChange(index, 'discount', e.target.value)}
                                                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="number"
                                                        value={line.taxes}
                                                        onChange={(e) => handleOrderLineChange(index, 'taxes', e.target.value)}
                                                        className="w-full bg-transparent outline-none border-b border-transparent focus:border-primary"
                                                        step="0.01"
                                                        min="0"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    ${line.amount.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleRemoveOrderLine(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Delete style={{ fontSize: 18 }} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Button
                                                    variant="ghost"
                                                    className="text-primary hover:bg-primary/5 w-full justify-start"
                                                    onClick={handleAddOrderLine}
                                                >
                                                    <Add className="mr-2" style={{ fontSize: 18 }} />
                                                    Add Line
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="bg-gray-50 font-semibold">
                                            <TableCell colSpan={5} className="text-right">Total Amount:</TableCell>
                                            <TableCell className="text-lg">${calculateTotalAmount().toFixed(2)}</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )
                    }

                    {
                        activeTab === 'other_info' && (
                            <div className="space-y-6 p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Salesperson
                                        </label>
                                        <input
                                            type="text"
                                            name="salesperson"
                                            value={otherInfo.salesperson}
                                            onChange={handleOtherInfoChange}
                                            className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                            placeholder="Assigned salesperson"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            By default the login user is assigned as the Sales person
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={otherInfo.start_date}
                                            onChange={handleOtherInfoChange}
                                            className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            By default the day on which the quotation is confirmed will populate here
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Payment Method
                                        </label>
                                        <input
                                            type="text"
                                            name="payment_method"
                                            value={otherInfo.payment_method}
                                            onChange={handleOtherInfoChange}
                                            className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                            placeholder="e.g., Credit Card, Bank Transfer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Which payment method is used for payment it should be updated after payment is done
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            name="payment_done"
                                            checked={otherInfo.payment_done}
                                            onChange={handleOtherInfoChange}
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label className="text-sm font-medium text-text-primary">
                                            Payment Done
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >
            </Drawer >
        </div >
    );
};

export default Subscriptions;
