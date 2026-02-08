import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Search } from '@mui/icons-material';
import { useGetProductsQuery, useGetCategoriesQuery } from '../services/productsApi';
import { useAddToCartMutation } from '../services/cartApi';
import Toast from '../components/ui/Toast';

const Shop = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(100000);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Fetch Categories
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
    const dynamicCategories = ["All Products", ...(categoriesData || [])];

    // Fetch Products from API
    const { data: productsData, isLoading, isError } = useGetProductsQuery({
        page: 1,
        size: 50,
        search: searchTerm
    });

    const [addToCart] = useAddToCartMutation();

    const [sortBy, setSortBy] = useState('Newest Arrivals');

    // Client-side filtering and sorting
    const allProducts = productsData?.items || [];
    const products = allProducts
        .filter(product => {
            // Price Filter
            const priceMatch = product.sales_price <= priceRange;
            
            // Category Filter
            const isAllSelected = selectedCategories.includes("All Products") || selectedCategories.length === 0;
            const categoryMatch = isAllSelected || (product.category && selectedCategories.includes(product.category));

            return priceMatch && categoryMatch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'Price: Low to High':
                    return a.sales_price - b.sales_price;
                case 'Price: High to Low':
                    return b.sales_price - a.sales_price;
                case 'Newest Arrivals':
                default:
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (category === "All Products") {
                 return ["All Products"];
            }
            
            let newCategories = prev.filter(c => c !== "All Products");

            if (newCategories.includes(category)) {
                return newCategories.filter(c => c !== category);
            } else {
                return [...newCategories, category];
            }
        });
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart({ product_id: productId, quantity: 1 }).unwrap();
            setToastMessage('Product added to cart!');
            setShowToast(true);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            if (error.status === 401) {
                setToastMessage('Please login to add items to cart');
            } else {
                setToastMessage('Failed to add to cart');
            }
            setShowToast(true);
        }
    };

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
                             {isCategoriesLoading ? (
                                <div className="text-sm text-gray-500">Loading categories...</div>
                             ) : (
                                dynamicCategories.map((cat) => (
                                    <div key={cat} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={cat}
                                            checked={selectedCategories.includes(cat) || (selectedCategories.length === 0 && cat === "All Products")}
                                            onChange={() => handleCategoryChange(cat)}
                                            className="mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor={cat} className="text-sm text-text-secondary cursor-pointer hover:text-primary transition-colors">
                                            {cat}
                                        </label>
                                    </div>
                                ))
                             )}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="bg-white rounded-lg shadow-sm border border-border-light p-4">
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
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
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-border-light bg-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
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
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-text-secondary group-hover:bg-gray-50 transition-colors overflow-hidden">
                                        {/* Product Image or Placeholder */}
                                        {product.main_image ? (
                                            <img
                                                src={product.main_image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-gray-400">
                                                {product.name.charAt(0)}
                                            </span>
                                        )}
                                        {/* Fallback span if image fails (hidden by default if image exists) */}
                                        <span className="text-sm font-medium text-gray-400 hidden">
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/shop/${product.id}`);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Shop;
