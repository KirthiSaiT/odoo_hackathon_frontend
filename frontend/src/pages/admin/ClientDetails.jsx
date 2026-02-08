// Client Details Page
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastProvider';
import { usePermissions } from '../../contexts/PermissionContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Drawer from '../../components/ui/drawer';
import { Input } from '../../components/ui/input';
import {
  ArrowBack,
  Person,
  Email,
  CalendarToday,
  AttachMoney,
  Add,
  History
} from '@mui/icons-material';
import { 
  useGetClientQuery, 
  useGetClientPaymentsQuery,
  useRecordPaymentMutation
} from '../../services/clientApi';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { canUpdate } = usePermissions('clients'); // reuse client permissions
  const [activeTab, setActiveTab] = useState('overview');
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'Credit Card',
    notes: '',
    paymentDate: new Date().toISOString().split('T')[0]
  });

  // API Hooks
  const { data: client, isLoading: isClientLoading } = useGetClientQuery(id);
  const { data: payments, isLoading: isPaymentsLoading } = useGetClientPaymentsQuery(id);
  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
        await recordPayment({
            clientId: parseInt(id),
            amount: parseFloat(paymentData.amount),
            payment_method: paymentData.paymentMethod,
            payment_date: paymentData.paymentDate,
            notes: paymentData.notes
        }).unwrap();
        toast.success('Payment recorded successfully');
        setIsPaymentDrawerOpen(false);
        setPaymentData({
            amount: '',
            paymentMethod: 'Credit Card',
            notes: '',
            paymentDate: new Date().toISOString().split('T')[0]
        });
    } catch (err) {
        toast.error('Failed to record payment');
    }
  };

  if (isClientLoading) {
      return <div className="p-8 text-center text-text-secondary">Loading client details...</div>;
  }

  if (!client) {
      return <div className="p-8 text-center text-red-500">Client not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/admin/clients')}>
                <ArrowBack className="mr-2" style={{ fontSize: 20 }} />
                Back to Clients
            </Button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-text-primary">{client.client_name}</h1>
                <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                    <Email style={{ fontSize: 16 }} /> {client.email}
                    <span className="mx-2">•</span>
                    <Badge variant={client.is_active ? 'success' : 'danger'}>
                        {client.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>
            {activeTab === 'payments' && canUpdate && (
                <Button onClick={() => setIsPaymentDrawerOpen(true)}>
                    <Add className="mr-2" style={{ fontSize: 20 }} />
                    Record Payment
                </Button>
            )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-light mb-6">
            <button
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'overview' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('overview')}
            >
                Overview
            </button>
            <button
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'payments' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setActiveTab('payments')}
            >
                Payments & History
            </button>
             {/* Add Subscription Tab later */}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border-light">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Person className="text-primary" />
                        Client Information
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-text-secondary">Contact Person</span>
                            <span className="font-medium text-text-primary">{client.contact_person || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-text-secondary">Email</span>
                            <span className="font-medium text-text-primary">{client.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-text-secondary">Joined Date</span>
                            <span className="font-medium text-text-primary">
                                {new Date(client.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-text-secondary">Subscription Status</span>
                            <Badge variant={
                                client.subscription_status === 'Active' ? 'success' : 
                                client.subscription_status === 'Pending' ? 'warning' : 'danger'
                            }>
                                {client.subscription_status}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                {/* Stats Card Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-border-light">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <History className="text-primary" />
                        Recent Activity
                    </h3>
                    <p className="text-text-secondary text-sm">No recent activity logged.</p>
                </div>
            </div>
        )}

        {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow-sm border border-border-light overflow-hidden">
                {isPaymentsLoading ? (
                    <div className="p-8 text-center text-text-secondary">Loading payments...</div>
                ) : payments && payments.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead>Recorded By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CalendarToday style={{ fontSize: 16 }} className="text-text-secondary" />
                                            {new Date(payment.payment_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-green-600">
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{payment.payment_method}</TableCell>
                                    <TableCell className="text-text-secondary">{payment.notes || '-'}</TableCell>
                                    <TableCell className="text-text-secondary">
                                        {/* Ideally fetch user name, but 'System' or ID for now */}
                                        User #{payment.created_by}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-12 text-center">
                        <AttachMoney className="text-gray-300 mb-3" style={{ fontSize: 48 }} />
                        <h3 className="text-lg font-medium text-text-primary">No Payments Recorded</h3>
                        <p className="text-text-secondary mt-1 max-w-sm mx-auto">
                            There are no payment records for this client yet. Click "Record Payment" to add one.
                        </p>
                    </div>
                )}
            </div>
        )}

        {/* Record Payment Drawer */}
        <Drawer
            isOpen={isPaymentDrawerOpen}
            onClose={() => setIsPaymentDrawerOpen(false)}
            title="Record Payment"
            width="max-w-md"
            footer={
                <>
                    <Button variant="outline" onClick={() => setIsPaymentDrawerOpen(false)}>Cancel</Button>
                    <Button onClick={handleRecordPayment} disabled={isRecording}>
                        {isRecording ? 'Recording...' : 'Save Payment'}
                    </Button>
                </>
            }
        >
            <form className="space-y-4 pt-2">
                <Input
                    label="Amount ($) *"
                    type="number"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    required
                />
                 <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">Payment Method *</label>
                    <select
                        value={paymentData.paymentMethod}
                        onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </div>
                <Input
                    label="Payment Date *"
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
                    required
                />
                <div>
                     <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
                     <textarea
                         value={paymentData.notes}
                         onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                         className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                         rows={3}
                     />
                </div>
            </form>
        </Drawer>
    </div>
  );
};

export default ClientDetails;
