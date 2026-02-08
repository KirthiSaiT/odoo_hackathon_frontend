// User Management Admin Page
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { useToast } from '../../components/ToastProvider';
import { usePermissions } from '../../contexts/PermissionContext';
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
  Person,
} from '@mui/icons-material';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetLookupsQuery 
} from '../../services/adminApi';

const Users = () => {
  const toast = useToast();
  const { canCreate, canUpdate, canDelete } = usePermissions('users');
  const currentUser = useSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: 3,
    is_active: true,
    password: '', // Helper for creation
  });

  // API Hooks
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useGetUsersQuery({ search: searchTerm });
  const { data: lookups } = useGetLookupsQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        is_active: user.is_active,
        password: '', // Don't show password
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role_id: 3, is_active: true, password: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role_id: 3, is_active: true, password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Prepare payload
        const payload = {
            id: editingUser.user_id,
            name: formData.name,
            role_id: formData.role_id,
            is_active: formData.is_active,
            // Only include password if provided
            ...(formData.password ? { password: formData.password } : {})
        };
        await updateUser(payload).unwrap();
        toast.success("User updated successfully");
        handleCloseModal();
      } else {
        await createUser(formData).unwrap();
        toast.success("User created successfully");
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to save user:", err);
      toast.error(err?.data?.detail || "Failed to save user");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        console.error('Failed to delete user:', err);
        toast.error(err?.data?.detail || 'Failed to delete user');
      }
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'EMPLOYEE':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
            <p className="text-text-secondary mt-1">Manage system users and their roles</p>
          </div>
          {canCreate && (
            <Button onClick={() => handleOpenModal()}>
              <Add className="mr-2" style={{ fontSize: 20 }} />
              Add User
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
        {isUsersLoading ? (
             <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : usersError ? (
             <div className="p-8 text-center text-red-500">Error loading users</div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.items?.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Person className="text-primary" style={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-text-secondary">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role_name || user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'success' : 'danger'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={'success'}>
                     Verified {/* Assuming verified for now or add field */}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="text-text-secondary" style={{ fontSize: 18 }} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
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
        
        {!isUsersLoading && usersData?.items?.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No users found matching your search.
          </div>
        )}
        </div>

      {/* Add/Edit User Drawer */}
      <Drawer
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? 'Edit User' : 'Add New User'}
          width="max-w-md"
          footer={
              <>
                  <Button variant="outline" type="button" onClick={handleCloseModal}>
                      Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit} disabled={isCreating || isUpdating}>
                      {editingUser ? (isUpdating ? 'Updating...' : 'Update') : (isCreating ? 'Creating...' : 'Create')} User
                  </Button>
              </>
          }
      >
          <form className="space-y-4 pt-2">
              <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter user name"
                  required
              />
              <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                  disabled={!!editingUser}
              />
              {!editingUser && (
                  <Input
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter password (optional)"
                      helperText="Leave blank to auto-generate"
                  />
              )}
              <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Role
                  </label>
                  <select
                      value={formData.role_id}
                      onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                      <option value={3}>Select Role</option>
                      {lookups?.roles?.map((role) => (
                          <option key={role.id} value={role.id}>
                              {role.name}
                          </option>
                      ))}
                  </select>
              </div>
              <div className="flex items-center gap-2">
                  <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm text-text-primary">
                      Active
                  </label>
              </div>
          </form>
      </Drawer>
    </div>
  );
};

export default Users;
