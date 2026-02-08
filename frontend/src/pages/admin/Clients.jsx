// Client Management Page
import React, { useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import { usePermissions } from '../../contexts/PermissionContext';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Drawer from '../../components/ui/drawer';
import { Input } from '../../components/ui/input';
import {
  Add,
  Edit,
  Delete,
  Search,
  Business,
  Visibility,
  Payment,
  Email as EmailIcon,
  Person
} from '@mui/icons-material';
import { useGetProductsQuery } from '../../services/productsApi';
import { 
  useGetClientsQuery, 
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation
} from '../../services/clientApi';

const Clients = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { canCreate, canUpdate, canDelete } = usePermissions('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    contactPerson: '',
    password: '',
    subscriptionStatus: 'Pending',
    isActive: true,
    productId: '',
    amount: 0,
    subscriptionStartDate: new Date().toISOString().split('T')[0], // Default to today
    paymentFrequency: 'Monthly'
  });

  // API Hooks
  const { data: clientsData, isLoading, error } = useGetClientsQuery({ search: searchTerm });
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ page: 1, size: 100 }); // Fetch enough for dropdown
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();


  const handleOpenDrawer = (client = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (client) {
      setEditingClient(client);
      setFormData({
        clientName: client.client_name,
        email: client.email,
        contactPerson: client.contact_person,
        password: '', 
        subscriptionStatus: client.subscription_status,
        isActive: client.is_active,
        productId: client.product_id || '',
        amount: client.amount || 0,
        paymentFrequency: client.payment_frequency || 'Monthly',
        subscriptionStartDate: client.subscription_start_date ? client.subscription_start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingClient(null);
      setFormData({
        clientName: '',
        email: '',
        contactPerson: '',
        password: '',
        subscriptionStatus: 'Pending',
        isActive: true,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingClient(null);
    setIsViewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        // Update
        const payload = {
            id: editingClient.id,
            client_name: formData.clientName,
            email: formData.email,
            contact_person: formData.contactPerson,
            subscription_status: formData.subscriptionStatus,
            is_active: formData.isActive,
            // Subscription updates
            product_id: formData.productId ? Number(formData.productId) : null,
            amount: formData.amount ? Number(formData.amount) : null,
            payment_frequency: formData.paymentFrequency,
            subscription_start_date: formData.subscriptionStartDate
        };
        await updateClient(payload).unwrap();
        toast.success('Client updated successfully');
      } else {
        // Create
        const payload = {
            client_name: formData.clientName,
            email: formData.email,
            contact_person: formData.contactPerson,
            password: formData.password,
            product_id: formData.productId ? Number(formData.productId) : null,
            amount: formData.amount ? Number(formData.amount) : 0,
            payment_frequency: formData.paymentFrequency,
            subscription_start_date: formData.subscriptionStartDate || null
        };
        await createClient(payload).unwrap();
        toast.success('Client created! Welcome email with billing details and reset link sent.');
      }
      handleCloseDrawer();
    } catch (err) {
      console.error('Failed to save client:', err);
      const errorMsg = err?.data?.detail 
        ? (typeof err.data.detail === 'object' ? JSON.stringify(err.data.detail) : err.data.detail)
        : 'Failed to save client';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id).unwrap();
        toast.success('Client deleted successfully');
      } catch (err) {
        console.error('Failed to delete client:', err);
        toast.error(err?.data?.detail || 'Failed to delete client');
      }
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Client Management</h1>
            <p className="text-text-secondary mt-1">Manage client accounts and subscriptions</p>
          </div>
          {canCreate && (
            <Button onClick={() => handleOpenDrawer()}>
              <Add className="mr-2" style={{ fontSize: 20 }} />
              Add Client
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading clients...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Error loading clients</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData?.items?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Business className="text-blue-600" style={{ fontSize: 20 }} />
                        </div>
                        <span className="font-medium text-text-primary">{client.client_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                             <Person className="text-gray-400" style={{ fontSize: 16 }} />
                             {client.contact_person || '-'}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <EmailIcon className="text-gray-400" style={{ fontSize: 16 }} />
                            {client.email}
                        </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                          client.subscription_status === 'Active' ? 'success' : 
                          client.subscription_status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {client.subscription_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.is_active ? 'success' : 'danger'}>
                        {client.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details / Payments */}
                         <button
                          onClick={() => navigate(`/clients/${client.id}`)}
                          className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
                          title="View Details & Payments"
                        >
                          <Payment className="text-purple-500" style={{ fontSize: 18 }} />
                        </button>

                        <button
                          onClick={() => handleOpenDrawer(client, true)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Info"
                        >
                          <Visibility className="text-blue-500" style={{ fontSize: 18 }} />
                        </button>
                        {canUpdate && (
                             <>
                                <button
                                    onClick={() => handleOpenDrawer(client)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="text-text-secondary" style={{ fontSize: 18 }} />
                                </button>
                             </>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Delete className="text-red-500" style={{ fontSize: 18 }} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && clientsData?.items?.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              No clients found.
            </div>
          )}
        </div>

        {/* Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          title={isViewMode ? 'View Client' : editingClient ? 'Edit Client' : 'Add New Client'}
          width="max-w-5xl"
          footer={
            <>
              <Button variant="outline" type="button" onClick={handleCloseDrawer}>
                Close
              </Button>
              {!isViewMode && (
                <Button type="button" onClick={handleSubmit} disabled={isCreating || isUpdating}>
                  {isCreating ? 'Creating...' : (editingClient ? (isUpdating ? 'Updating...' : 'Update') : 'Create')}
                </Button>
              )}
            </>
          }
        >
             <form className="pt-2 pb-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Client Name *"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                        disabled={isViewMode}
                    />
                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isViewMode}
                    />
                    <Input
                        label="Contact Person"
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        disabled={isViewMode}
                    />
                     {/* Include Password here if creating/editing to save space */}
                    {!editingClient && !isViewMode && (
                        <Input
                            label="Password *"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            helperText="Password for the client's user account"
                        />
                    )}
                </div>
                
                <div className="space-y-4 border-t pt-4 mt-2">
                    <h3 className="font-medium text-text-primary">Subscription Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Project / Plan *</label>
                            <select
                                value={formData.productId || ''}
                                onChange={(e) => {
                                    const pid = Number(e.target.value);
                                    const product = productsData?.items?.find(p => p.id === pid);
                                    setFormData({
                                        ...formData, 
                                        productId: pid,
                                        amount: product ? product.sales_price : 0
                                    });
                                }}
                                required
                                disabled={isViewMode}
                                className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Select a Project/Plan</option>
                                {productsLoading ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    productsData?.items?.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.product_type})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div>
                            <Input
                                label="Agreed Amount *"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                                min="0"
                                step="0.01"
                                required
                                disabled={isViewMode}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">Payment Frequency</label>
                            <select
                                value={formData.paymentFrequency || 'Monthly'}
                                onChange={(e) => setFormData({...formData, paymentFrequency: e.target.value})}
                                disabled={isViewMode}
                                className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="One-Time">One-Time</option>
                            </select>
                        </div>

                        <div>
                            <Input
                                label="Subscription Start Date"
                                type="date"
                                value={formData.subscriptionStartDate || ''}
                                onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value })}
                                disabled={isViewMode}
                            />
                        </div>
                    </div>
                </div>
                
                {editingClient && (
                     <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Subscription Status</label>
                        <select
                            value={formData.subscriptionStatus}
                            onChange={(e) => setFormData({...formData, subscriptionStatus: e.target.value})}
                            disabled={isViewMode}
                            className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                )}
                
                {editingClient && (
                    <div className="flex items-center gap-2 mt-4">
                       <input
                           type="checkbox"
                           id="is_active"
                           checked={formData.isActive}
                           onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                           disabled={isViewMode}
                           className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
                       />
                       <label htmlFor="is_active" className="text-sm text-text-primary">Active</label>
                   </div>
                )}

             </form>
        </Drawer>
    </div>
  );
};

export default Clients;
