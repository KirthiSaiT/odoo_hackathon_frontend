import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

const Shop = () => {
    const [priceRange, setPriceRange] = useState(1000);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        "All Products", "Electronics", "Clothing", "Home & Garden", "Sports", "Toys"
    ];

    const products = [
        { id: 1, name: "Premium Headphones", price: 299, type: "Electronics", billing: "One-time" },
        { id: 2, name: "Ergonomic Chair", price: 199, type: "Home & Garden", billing: "One-time" },
        { id: 3, name: "Smart Watch", price: 149, type: "Electronics", billing: "One-time" },
        { id: 4, name: "Running Shoes", price: 89, type: "Sports", billing: "One-time" },
        { id: 5, name: "Cotton T-Shirt", price: 25, type: "Clothing", billing: "One-time" },
        { id: 6, name: "Yoga Mat", price: 35, type: "Sports", billing: "One-time" },
        { id: 7, name: "Coffee Maker", price: 79, type: "Home & Garden", billing: "One-time" },
        { id: 8, name: "Bluetooth Speaker", price: 59, type: "Electronics", billing: "One-time" },
    ];

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar - Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                    {/* Category Filter */}
                    <div className="border-2 border-primary rounded-lg p-4 bg-background-paper">
                        <h3 className="text-xl font-handwritten text-primary mb-4">Category</h3>
                        <div className="space-y-2">
                            {categories.map((cat) => (
                                <div key={cat} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={cat}
                                        className="mr-2 accent-primary"
                                    />
                                    <label htmlFor={cat} className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
                                        {cat}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="border-2 border-primary rounded-lg p-4 bg-background-paper">
                        <h3 className="text-xl font-handwritten text-primary mb-4">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full accent-primary mb-2"
                        />
                        <div className="flex justify-between text-sm font-medium">
                            <span>$0</span>
                            <span>${priceRange}</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header */}
                    <div className="border-2 border-primary rounded-lg p-6 bg-background-paper mb-8">
                        <h1 className="text-3xl font-handwritten text-primary mb-2">All Products</h1>
                        <p className="text-text-secondary text-sm">Browse our collection of premium items</p>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                        <div className="relative w-full sm:w-64 border-2 border-primary rounded-full overflow-hidden bg-background-paper">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full px-4 py-2 outline-none bg-transparent placeholder-text-secondary"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Sort By:</span>
                            <select className="border-2 border-primary rounded-md px-2 py-1 bg-background-paper outline-none text-sm">
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="border-2 border-primary rounded-lg p-4 bg-background-paper flex flex-col hover:shadow-lg transition-shadow">
                                <div className="aspect-square bg-gray-200 rounded-md mb-4 flex items-center justify-center text-text-secondary">
                                    {/* Placeholder for Product Image */}
                                    <span className="text-xs">Image</span>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium text-lg leading-tight">{product.name}</h3>
                                            <p className="text-xs text-text-secondary">{product.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-dashed border-primary/30 pt-3 mt-2">
                                        <div>
                                            <span className="block text-xl font-bold text-primary">${product.price}</span>
                                            <span className="text-[10px] text-text-secondary uppercase tracking-wider">{product.billing}</span>
                                        </div>
                                        <Button size="sm" className="h-8 px-3 text-xs">
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Shop;
