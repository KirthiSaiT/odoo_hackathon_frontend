// Employee Management Admin Page - Bailley Style
import React, { useState, useEffect } from 'react';
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
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/ui/modal';
import { Input } from '../../components/ui/input';
import {
  Add,
  Edit,
  Delete,
  Search,
  Business,
  Visibility,
} from '@mui/icons-material';
import { 
  useGetEmployeesQuery, 
  useGetLookupsQuery, 
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation
} from '../../services/adminApi';

const Employees = () => {
  const toast = useToast();
  const { canCreate, canUpdate, canDelete } = usePermissions('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    genderId: '',
    maritalStatusId: '',
    bloodGroupId: '',
    dateOfJoining: '',
    designationId: '',
    departmentId: '',
    employmentType: '',
    employmentStatus: 1,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    countryId: 1,
    additionalNotes: '',
    roleId: 3,
    isActive: true,
  });

  // API Hooks
  const { data: employeesData, isLoading: isEmployeesLoading, error: employeesError } = useGetEmployeesQuery({ search: searchTerm });
  const { data: lookups, isLoading: isLookupsLoading } = useGetLookupsQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const getLookupName = (list, id) => list?.find(item => item.id === id)?.name || '-';

  const handleOpenModal = (employee = null, viewOnly = false) => {
    setIsViewMode(viewOnly);
    if (employee) {
      setEditingEmployee(employee);
      // Map API response to form fields (snake_case to camelCase mapping if needed, but our API returns compatible names)
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName || '',
        email: employee.email,
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth || '',
        genderId: employee.genderId || '',
        maritalStatusId: employee.maritalStatusId || '',
        bloodGroupId: employee.bloodGroupId || '',
        dateOfJoining: employee.dateOfJoining || '',
        designationId: employee.designationId || '',
        departmentId: employee.departmentId || '',
        employmentType: employee.employmentType || '',
        employmentStatus: employee.employmentStatus || 1,
        addressLine1: employee.addressLine1 || '',
        addressLine2: employee.addressLine2 || '',
        city: employee.city || '',
        state: employee.state || '',
        postalCode: employee.postalCode || '',
        countryId: employee.countryId || 1,
        additionalNotes: employee.additionalNotes || '',
        roleId: employee.roleId || 3,
        isActive: employee.isActive,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        dateOfBirth: '', genderId: '', maritalStatusId: '', bloodGroupId: '',
        dateOfJoining: '', designationId: '', departmentId: '', employmentType: '',
        employmentStatus: 1, addressLine1: '', addressLine2: '', city: '', state: '',
        postalCode: '', countryId: 1, additionalNotes: '', roleId: 3, isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setIsViewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const apiPayload = {
          id: editingEmployee.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender_id: formData.genderId || null,
          marital_status_id: formData.maritalStatusId || null,
          blood_group_id: formData.bloodGroupId || null,
          date_of_joining: formData.dateOfJoining || null,
          designation_id: formData.designationId || null,
          department_id: formData.departmentId || null,
          employment_type: formData.employmentType || null,
          employment_status: formData.employmentStatus || 1,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country_id: formData.countryId || null,
          additional_notes: formData.additionalNotes,
          role_id: formData.roleId,
          is_active: formData.isActive
        };

        await updateEmployee(apiPayload).unwrap();
        toast.success('Employee updated successfully');
        handleCloseModal();
      } else {
        // Create Logic
        const apiPayload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          gender_id: formData.genderId || null,
          marital_status_id: formData.maritalStatusId || null,
          blood_group_id: formData.bloodGroupId || null,
          date_of_joining: formData.dateOfJoining || null,
          designation_id: formData.designationId || null,
          department_id: formData.departmentId || null,
          employment_type: formData.employmentType || null,
          employment_status: formData.employmentStatus || 1,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country_id: formData.countryId || null,
          additional_notes: formData.additionalNotes,
          role_id: formData.roleId,
          is_active: formData.isActive
        };

        await createEmployee(apiPayload).unwrap();
        toast.success('Employee created successfully! Login credentials have been generated.');
        handleCloseModal();
      }
    } catch (err) {
      console.error('Failed to save employee:', err);
      toast.error(err?.data?.detail || 'Failed to save employee');
    }
  };

  const handleDelete = async (empId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(empId).unwrap();
        toast.success('Employee deleted successfully');
      } catch (err) {
        console.error('Failed to delete employee:', err);
        toast.error(err?.data?.detail || 'Failed to delete employee');
      }
    }
  };

  const SelectField = ({ label, value, onChange, options, disabled }) => (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled || isLookupsLoading}
        className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
      >
        <option value="">{isLookupsLoading ? 'Loading...' : `Select ${label}`}</option>
        {options?.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Employee Management</h1>
            <p className="text-text-secondary mt-1">Manage employee records</p>
          </div>
          {canCreate && (
            <Button onClick={() => handleOpenModal()}>
              <Add className="mr-2" style={{ fontSize: 20 }} />
              Add Employee
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isEmployeesLoading ? (
            <div className="p-8 text-center text-gray-500">Loading employees...</div>
          ) : employeesError ? (
            <div className="p-8 text-center text-red-500">Error loading employees</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow hoverable={false}>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeesData?.items?.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{emp.id}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Business className="text-green-600" style={{ fontSize: 20 }} />
                        </div>
                        <div>
                          <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                          <p className="text-sm text-text-secondary">{emp.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{emp.department_name || '-'}</TableCell>
                    <TableCell>{emp.designation_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={emp.role_id === 1 ? 'danger' : emp.role_id === 2 ? 'primary' : 'default'}>
                        {emp.role_name || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={emp.is_active ? 'success' : 'danger'}>
                        {emp.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal({
                             firstName: emp.first_name,
                             lastName: emp.last_name,
                             phone: emp.phone_number,
                             dateOfBirth: emp.date_of_birth,
                             genderId: emp.gender_id,
                             maritalStatusId: emp.marital_status_id,
                             bloodGroupId: emp.blood_group_id,
                             dateOfJoining: emp.date_of_joining,
                             designationId: emp.designation_id,
                             departmentId: emp.department_id,
                             employmentType: emp.employment_type,
                             employmentStatus: emp.employment_status,
                             addressLine1: emp.address_line1,
                             addressLine2: emp.address_line2,
                             postalCode: emp.postal_code,
                             countryId: emp.country_id,
                             additionalNotes: emp.additional_notes,
                             roleId: emp.role_id,
                             isActive: emp.is_active,
                             ...emp
                          }, true)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View"
                        >
                          <Visibility className="text-blue-500" style={{ fontSize: 18 }} />
                        </button>
                        {canUpdate && (
                          <button
                            onClick={() => handleOpenModal({
                               firstName: emp.first_name,
                               lastName: emp.last_name,
                               phone: emp.phone_number,
                               dateOfBirth: emp.date_of_birth,
                               genderId: emp.gender_id,
                               maritalStatusId: emp.marital_status_id,
                               bloodGroupId: emp.blood_group_id,
                               dateOfJoining: emp.date_of_joining,
                               designationId: emp.designation_id,
                               departmentId: emp.department_id,
                               employmentType: emp.employment_type,
                               employmentStatus: emp.employment_status,
                               addressLine1: emp.address_line1,
                               addressLine2: emp.address_line2,
                               postalCode: emp.postal_code,
                               countryId: emp.country_id,
                               additionalNotes: emp.additional_notes,
                               roleId: emp.role_id,
                               isActive: emp.is_active,
                               ...emp
                            })}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="text-text-secondary" style={{ fontSize: 18 }} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(emp.id)}
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

          {!isEmployeesLoading && employeesData?.items?.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              No employees found matching your search.
            </div>
          )}
        </div>


      {/* Add/Edit/View Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalHeader onClose={handleCloseModal}>
          {isViewMode ? 'View Employee' : editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {/* Personal Information */}
              <h3 className="text-md font-semibold text-text-primary mb-3 pb-2 border-b border-border-light">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  required
                  disabled={isViewMode}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  disabled={isViewMode}
                />
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                  disabled={isViewMode}
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone"
                  disabled={isViewMode}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Gender"
                  value={formData.genderId}
                  onChange={(e) => setFormData({ ...formData, genderId: parseInt(e.target.value) })}
                  options={lookups?.genders}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Marital Status"
                  value={formData.maritalStatusId}
                  onChange={(e) => setFormData({ ...formData, maritalStatusId: parseInt(e.target.value) })}
                  options={lookups?.marital_statuses}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Blood Group"
                  value={formData.bloodGroupId}
                  onChange={(e) => setFormData({ ...formData, bloodGroupId: parseInt(e.target.value) })}
                  options={lookups?.blood_groups}
                  disabled={isViewMode}
                />
              </div>

              {/* Employment Details */}
              <h3 className="text-md font-semibold text-text-primary mb-3 pb-2 border-b border-border-light">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Input
                  label="Date of Joining"
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Department"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) })}
                  options={lookups?.departments}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Designation"
                  value={formData.designationId}
                  onChange={(e) => setFormData({ ...formData, designationId: parseInt(e.target.value) })}
                  options={lookups?.designations}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Employment Type"
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: parseInt(e.target.value) })}
                  options={lookups?.employment_types}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: parseInt(e.target.value) })}
                  options={lookups?.employment_statuses}
                  disabled={isViewMode}
                />
                <SelectField
                  label="Role *"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: parseInt(e.target.value) })}
                  options={lookups?.roles}
                  disabled={isViewMode}
                />
              </div>

              {/* Address */}
              <h3 className="text-md font-semibold text-text-primary mb-3 pb-2 border-b border-border-light">
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="Address Line 1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Enter address"
                  disabled={isViewMode}
                />
                <Input
                  label="Address Line 2"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Enter address line 2"
                  disabled={isViewMode}
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Enter city"
                  disabled={isViewMode}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Enter state"
                  disabled={isViewMode}
                />
                <Input
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="Enter postal code"
                  disabled={isViewMode}
                />
                <SelectField
                  label="Country"
                  value={formData.countryId}
                  onChange={(e) => setFormData({ ...formData, countryId: parseInt(e.target.value) })}
                  options={lookups?.countries}
                  disabled={isViewMode}
                />
              </div>

              {/* Additional Notes */}
              <h3 className="text-md font-semibold text-text-primary mb-3 pb-2 border-b border-border-light">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Enter additional notes"
                    rows={3}
                    disabled={isViewMode}
                    className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:bg-gray-100"
                  />
                </div>
                <div className="flex items-center gap-2">
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
              </div>
            </div>
          </ModalContent>
          <ModalFooter>
            <Button variant="outline" type="button" onClick={handleCloseModal}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating ? 'Creating...' : (editingEmployee ? (isUpdating ? 'Updating...' : 'Update') : 'Create')} Employee
              </Button>
            )}
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
