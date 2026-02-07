import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Search } from '@mui/icons-material';
import { useGetProductsQuery } from '../services/productsApi';

const Shop = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(1000);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Fetch Products from API
    const { data: productsData, isLoading, isError } = useGetProductsQuery({
        page: 1,
        size: 50,
        search: searchTerm
    });

    const products = productsData?.items || [];

    const categories = [
        "All Products", "Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Goods", "Service"
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-text-primary font-sans">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar - Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    {/* Category Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-border-light p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Category</h3>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <div key={cat} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={cat}
                                        className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={cat} className="text-sm text-text-secondary cursor-pointer hover:text-primary transition-colors">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-border-light p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mb-2"
                        />
                        <div className="flex justify-between text-sm text-text-secondary font-medium">
                            <span>$0</span>
                            <span>${priceRange}</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-border-light p-6 mb-6">
                        <h1 className="text-2xl font-bold text-text-primary mb-1">All Products</h1>
                        <p className="text-text-secondary text-sm">Browse our collection of premium items</p>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light bg-white text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-text-secondary">Sort By:</span>
                            <select className="px-3 py-2 rounded-lg border border-border-light bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading products...</div>
                    ) : isError ? (
                        <div className="text-center py-20 text-red-500">Failed to load products.</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-border-light p-4 flex flex-col hover:shadow-md transition-all duration-200 group">
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-text-secondary group-hover:bg-gray-50 transition-colors">
                                        {/* Placeholder for Product Image */}
                                        <span className="text-sm font-medium text-gray-400">
                                            {product.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="mb-2">
                                            <h3 className="font-semibold text-text-primary leading-tight mb-1 truncate" title={product.name}>{product.name}</h3>
                                            <p className="text-xs text-text-secondary bg-gray-100 inline-block px-2 py-0.5 rounded-full">{product.product_type}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
                                            <div>
                                                <span className="block text-lg font-bold text-text-primary">${product.sales_price?.toFixed(2)}</span>
                                                <span className="text-[10px] text-text-secondary uppercase tracking-wider">
                                                    {product.tax ? `+ ${product.tax} Tax` : 'No Tax'}
                                                </span>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="h-8 px-4 text-xs font-medium"
                                                onClick={() => navigate(`/shop/${product.id}`)}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
