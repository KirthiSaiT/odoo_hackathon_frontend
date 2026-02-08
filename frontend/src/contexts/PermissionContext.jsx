/**
 * Permission Context & Hook
 * Fetches and provides current user's access rights across the application
 */
import { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { useGetMyRightsQuery } from '../services/adminApi';

// Create context
const PermissionContext = createContext(null);

/**
 * PermissionProvider - Wraps the app to provide permissions
 */
export function PermissionProvider({ children }) {
    const currentUser = useSelector(selectCurrentUser);
    
    // Fetch user rights when logged in
    const { data: rightsData, isLoading, refetch } = useGetMyRightsQuery(undefined, {
        skip: !currentUser, // Skip if not logged in
        refetchOnMountOrArgChange: true, // Refetch when component mounts
    });
    
    // Convert rights array to a map for easy lookup
    const permissionsMap = useMemo(() => {
        const map = {};
        if (rightsData?.rights) {
            rightsData.rights.forEach(right => {
                map[right.module_key] = {
                    canView: right.can_view || false,
                    canCreate: right.can_create || false,
                    canUpdate: right.can_update || false,
                    canDelete: right.can_delete || false,
                };
            });
        }
        return map;
    }, [rightsData]);
    
    const value = {
        permissions: permissionsMap,
        isLoading,
        refetch,
        // Helper to get permissions for a specific module
        getModulePermissions: (moduleKey) => {
            return permissionsMap[moduleKey] || {
                canView: false,
                canCreate: false,
                canUpdate: false,
                canDelete: false,
            };
        },
    };
    
    return (
        <PermissionContext.Provider value={value}>
            {children}
        </PermissionContext.Provider>
    );
}

/**
 * usePermissions - Hook to access permissions
 * @param {string} moduleKey - Optional module key to get specific permissions
 * @returns {{ canView, canCreate, canUpdate, canDelete, isLoading }}
 */
export function usePermissions(moduleKey = null) {
    const context = useContext(PermissionContext);
    
    if (!context) {
        // Return default permissions if not wrapped in provider
        // This allows components to work even without the provider
        return {
            canView: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            isLoading: false,
        };
    }
    
    if (moduleKey) {
        const modulePerms = context.getModulePermissions(moduleKey);
        return {
            ...modulePerms,
            isLoading: context.isLoading,
        };
    }
    
    return {
        permissions: context.permissions,
        isLoading: context.isLoading,
        refetch: context.refetch,
        getModulePermissions: context.getModulePermissions,
    };
}

export default PermissionProvider;
