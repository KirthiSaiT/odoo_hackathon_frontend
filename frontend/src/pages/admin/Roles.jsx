// Role Management Admin Page
import React, { useState } from 'react';

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
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/ui/modal';
import { Input } from '../../components/ui/input';
import {
  Add,
  Edit,
  Delete,
  Security,
} from '@mui/icons-material';
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../../services/adminApi';

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    is_active: true,
  });

  // API Hooks
  const { data: rolesData, isLoading, error } = useGetRolesQuery({ page: 1, size: 100 });
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();

  const roles = rolesData?.items || [];

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        role_name: role.role_name,
        description: role.description || '',
        is_active: role.is_active,
      });
    } else {
      setEditingRole(null);
      setFormData({ role_name: '', description: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setFormData({ role_name: '', description: '', is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await updateRole({
          id: editingRole.role_id,
          role_name: formData.role_name,
          description: formData.description,
          is_active: formData.is_active,
        }).unwrap();
      } else {
        await createRole(formData).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save role:', err);
      alert(err.data?.detail || 'Failed to save role');
    }
  };

  const handleDelete = async (roleId) => {
    // Prevent deleting system roles
    if (roleId <= 3) {
      alert('Cannot delete system roles (Admin, Employee, User)');
      return;
    }
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId).unwrap();
      } catch (err) {
        console.error('Failed to delete role:', err);
        alert(err.data?.detail || 'Failed to delete role');
      }
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case 'Admin':
        return 'bg-red-500';
      case 'Employee':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading roles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading roles: {error.data?.detail || 'Unknown error'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Role Management</h1>
            <p className="text-text-secondary mt-1">Manage system roles and their descriptions</p>
          </div>
          <Button onClick={() => handleOpenModal()} disabled={isCreating}>
            <Add className="mr-2" style={{ fontSize: 20 }} />
            Add Role
          </Button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> System roles (Admin, Employee, User) cannot be deleted. Configure their permissions in{' '}
            <a href="/admin/role-rights" className="underline font-medium">Role Rights</a>.
          </p>
        </div>

        {/* Roles Table */}
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead>Role ID</TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.role_id}>
                <TableCell>
                  <span className="font-mono text-sm">{role.role_id}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getRoleBadgeColor(role.role_name)} flex items-center justify-center`}>
                      <Security className="text-white" style={{ fontSize: 20 }} />
                    </div>
                    <span className="font-medium">{role.role_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-text-secondary">{role.description || '-'}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={role.is_active ? 'success' : 'danger'}>
                    {role.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(role)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      disabled={isUpdating}
                    >
                      <Edit className="text-text-secondary" style={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(role.role_id)}
                      className={`p-2 rounded-lg transition-colors ${
                        role.role_id <= 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
                      }`}
                      disabled={role.role_id <= 3 || isDeleting}
                    >
                      <Delete className={role.role_id <= 3 ? 'text-gray-300' : 'text-red-500'} style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      {/* Add/Edit Role Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="md">
        <ModalHeader onClose={handleCloseModal}>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <Input
                label="Role Name"
                value={formData.role_name}
                onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                placeholder="Enter role name"
                required
                disabled={editingRole && editingRole.role_id <= 3}
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter role description"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
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
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : (editingRole ? 'Update' : 'Create')} Role
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
