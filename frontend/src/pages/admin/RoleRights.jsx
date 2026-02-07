// Access Rights Configuration Page
import React, { useState, useEffect } from 'react';

import { Button } from '../../components/ui/button';
import { Save } from '@mui/icons-material';
import { 
  useGetEmployeesQuery, 
  useGetUserRightsQuery, 
  useSaveUserRightsMutation 
} from '../../services/adminApi';

const modules = [
  { module_id: 1, module_name: 'Dashboard', module_key: 'dashboard' },
  { module_id: 2, module_name: 'User Management', module_key: 'users' },
  { module_id: 3, module_name: 'Role Management', module_key: 'roles' },
  { module_id: 4, module_name: 'Employee Management', module_key: 'employees' },
  { module_id: 5, module_name: 'Access Rights', module_key: 'role_rights' }, // Kept key as role_rights for compatibility or change to access_rights? user said 'role_rights' in navbar
];

const AccessRights = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [rights, setRights] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  // API Hooks
  const { data: employeesData, isLoading: isEmployeesLoading } = useGetEmployeesQuery({ page: 1, size: 100 }); // Fetch first 100 for dropdown
  const { data: userRightsData, isFetching: isRightsFetching } = useGetUserRightsQuery(selectedEmployee?.user_id, {
    skip: !selectedEmployee?.user_id
  });
  const [saveUserRights, { isLoading: isSaving }] = useSaveUserRightsMutation();

  // Load rights when data fetching completes
  useEffect(() => {
    if (userRightsData?.rights) {
      const rightsMap = {};
      userRightsData.rights.forEach(r => {
        rightsMap[r.module_key] = {
           can_view: r.can_view,
           can_create: r.can_create,
           can_update: r.can_update,
           can_delete: r.can_delete
        };
      });
      setRights(rightsMap);
      setHasChanges(false);
    } else if (selectedEmployee && !isRightsFetching) {
        // Reset if no rights found
        setRights({});
        setHasChanges(false);
    }
  }, [userRightsData, selectedEmployee]);

  const handleToggle = (moduleKey, permission) => {
    setRights((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [permission]: !prev[moduleKey]?.[permission],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!selectedEmployee?.user_id) return;
    
    // Convert rights map to list
    const rightsList = Object.entries(rights).map(([key, perms]) => ({
        user_id: selectedEmployee.user_id,
        module_key: key,
        can_view: perms.can_view || false,
        can_create: perms.can_create || false,
        can_update: perms.can_update || false,
        can_delete: perms.can_delete || false
    })).filter(r => r.can_view || r.can_create || r.can_update || r.can_delete); // Only save if at least one permission is true? Backend deletes all then inserts.

    try {
        await saveUserRights({ userId: selectedEmployee.user_id, rights: rightsList }).unwrap();
        setHasChanges(false);
        alert('Access rights saved successfully!');
    } catch (err) {
        console.error("Failed to save rights:", err);
        alert("Failed to save rights");
    }
  };

  const getRights = (moduleKey) => {
    return rights[moduleKey] || { can_view: false, can_create: false, can_update: false, can_delete: false };
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Access Rights Configuration</h1>
            <p className="text-text-secondary mt-1">Configure module access permissions for each employee</p>
          </div>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving || !selectedEmployee}>
            <Save className="mr-2" style={{ fontSize: 20 }} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Employee Selector */}
        <div className="bg-background-paper rounded-lg border border-border-light p-4 mb-6">
          <h2 className="text-sm font-medium text-text-secondary mb-3">Select Employee</h2>
           {isEmployeesLoading ? (
               <div>Loading employees...</div>
           ) : (
          <div className="max-w-md">
            <select
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const empId = parseInt(e.target.value);
                const emp = employeesData?.items?.find(emp => emp.id === empId);
                setSelectedEmployee(emp || null);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-border-light bg-background-paper text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Select an Employee --</option>
              {employeesData?.items?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} - {emp.email}
                </option>
              ))}
            </select>
          </div>
          )}
          {selectedEmployee && (
            <p className="text-sm text-text-secondary mt-3">
              Configuring rights for: <strong>{selectedEmployee.first_name} {selectedEmployee.last_name}</strong> ({selectedEmployee.role_name || selectedEmployee.role || 'Employee'})
            </p>
          )}
        </div>

        {/* Permissions Matrix */}
        {selectedEmployee && (
        <div className="bg-background-paper rounded-lg border border-border-light overflow-hidden">
          {isRightsFetching ? (
              <div className="p-8 text-center text-gray-500">Loading rights...</div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Create
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Update
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {modules.map((module) => {
                  const moduleRights = getRights(module.module_key);
                  return (
                    <tr key={module.module_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-text-primary">{module.module_name}</span>
                        <span className="block text-sm text-text-secondary">/{module.module_key}</span>
                      </td>
                      {['can_view', 'can_create', 'can_update', 'can_delete'].map((perm) => (
                        <td key={perm} className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggle(module.module_key, perm)}
                            className={`
                              w-8 h-8 rounded-lg transition-all duration-200
                              ${moduleRights[perm]
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                              }
                            `}
                          >
                            {moduleRights[perm] ? '✓' : '✕'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>
        )}
        
        {!selectedEmployee && (
            <div className="text-center py-12 text-text-secondary bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Please select an employee to configure access rights.
            </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
            <span>Permission Granted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-200 text-gray-400 flex items-center justify-center text-xs">✕</div>
            <span>Permission Denied</span>
          </div>
        </div>

    </div>
  );
};

export default AccessRights;
