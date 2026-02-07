import Navbar from '../components/Navbar';

const UserDetails = () => {
    // Mock user data - replace with actual user data from Redux/API
    const user = {
        name: 'True Jay',
        email: 'truejay@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main Street, City, State, ZIP',
        city: 'San Francisco',
        state: 'California',
        zipCode: '94102',
        country: 'United States',
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Page Title */}
                <h1 className="text-4xl font-semibold text-gray-800 mb-8">
                    User Details
                </h1>

                {/* User Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 px-8 py-6 border-b border-cyan-200">
                        <h2 className="text-2xl font-semibold text-cyan-700">
                            Personal Information
                        </h2>
                    </div>

                    {/* Card Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* User Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    User Name
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Email
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.email}</p>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Phone Number
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.phone}</p>
                                </div>
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    City
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.city}</p>
                                </div>
                            </div>

                            {/* State */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    State
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.state}</p>
                                </div>
                            </div>

                            {/* ZIP Code */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    ZIP Code
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.zipCode}</p>
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Country
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.country}</p>
                                </div>
                            </div>

                            {/* Address - Full Width */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-600 uppercase tracking-wide">
                                    Address
                                </label>
                                <div className="bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-3">
                                    <p className="text-gray-800 font-medium">{user.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Additional Details
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Other details following, related to user
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
