import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from '../../services/profileApi';
import { useToast } from '../ToastProvider';

/**
 * ProfileContent - Reusable profile form component
 * Can be used in both Admin and User layouts
 */
const ProfileContent = () => {
    const toast = useToast();
    const currentUser = useSelector(selectCurrentUser);
    const { data: profile, isLoading, isError, error } = useGetMyProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateMyProfileMutation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleEdit = () => {
        setFormData({
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone_number: profile?.phone_number || '',
            address_line1: profile?.address_line1 || '',
            address_line2: profile?.address_line2 || '',
            city: profile?.city || '',
            state: profile?.state || '',
            postal_code: profile?.postal_code || '',
            country_id: profile?.country_id || null,
        });
        setIsEditing(true);
        setErrorMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
        setErrorMessage('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData).unwrap();
            setIsEditing(false);
            toast.success('Profile updated successfully!');
            setErrorMessage('');
        } catch (err) {
            toast.error(err?.data?.detail || 'Failed to update profile');
            setErrorMessage(err?.data?.detail || 'Failed to update profile');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-6xl mx-auto px-8 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600">Failed to load profile: {error?.data?.detail || 'Unknown error'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-8 py-12">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-semibold text-gray-800">My Profile</h1>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50"
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {/* Error Message (inline for form validation) */}
            {errorMessage && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{errorMessage}</p>
                </div>
            )}

            {/* User Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 px-8 py-6 border-b border-cyan-200">
                    <h2 className="text-2xl font-semibold text-cyan-700">Personal Information</h2>
                </div>

                {/* Card Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.first_name || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.last_name || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Email</label>
                            <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                                <p className="text-gray-600 font-medium">{profile?.user_email || currentUser?.email || '-'}</p>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.phone_number || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">City</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.city || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">State</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.state || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Postal Code</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.postal_code || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Country</label>
                            <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                <p className="text-gray-800 font-medium">{profile?.country_name || '-'}</p>
                            </div>
                        </div>

                        {/* Address Line 1 - Full Width */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Address Line 1</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address_line1"
                                    value={formData.address_line1}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.address_line1 || '-'}</p>
                                </div>
                            )}
                        </div>

                        {/* Address Line 2 - Full Width */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">Address Line 2</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address_line2"
                                    value={formData.address_line2}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            ) : (
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{profile?.address_line2 || '-'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Details Section */}
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-sm text-gray-500">Role:</span>
                                <span className="ml-2 text-gray-700 font-medium">{profile?.user_role || currentUser?.role || '-'}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Profile Created:</span>
                                <span className="ml-2 text-gray-700 font-medium">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
