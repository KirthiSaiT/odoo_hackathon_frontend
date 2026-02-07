import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import Toast from '../components/ui/Toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);

    // Mock product data (in a real app, fetch based on ID)
    const product = {
        id: id,
        name: "Premium Headphones",
        category: "Electronics",
        images: [
            "image1", // Placeholders
            "image2",
            "image3"
        ],
        pricing: {
            monthly: { price: 1200, label: '1200/month', save: null },
            sixMonths: { price: 5760, label: '960/month', save: '20%' },
            yearly: { price: 10080, label: '840/month', save: '30%' }
        }
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="min-h-screen bg-background text-text-primary font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumbs */}
                <div className="text-sm text-text-secondary mb-8 font-handwritten text-lg">
                    <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/shop')}>All products</span>
                    <span className="mx-2">/</span>
                    <span className="cursor-pointer hover:text-primary">{product.category}</span>
                    <span className="mx-2">/</span>
                    <span className="text-primary">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column: Image Gallery */}
                    <div className="w-full">
                        <div className="flex gap-4 lg:gap-6">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4 w-16 lg:w-20 flex-shrink-0">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square border-2 rounded-lg cursor-pointer flex items-center justify-center bg-background-paper transition-colors ${selectedImage === index
                                            ? 'border-primary'
                                            : 'border-primary/30 hover:border-primary/60'
                                            }`}
                                    >
                                        <span className="text-xs text-text-secondary">img{index + 1}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 aspect-[4/3] border-2 border-primary rounded-lg bg-background-paper flex items-center justify-center">
                                <span className="text-text-secondary text-sm lg:text-lg">select image in big size</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="w-full">
                        <h1 className="text-3xl lg:text-4xl font-handwritten text-primary mb-6">{product.name}</h1>
                        <div className="border-b border-primary/30 mb-6"></div>

                        {/* Pricing Table */}
                        <div className="border-2 border-primary rounded-xl overflow-hidden mb-6 bg-background-paper">
                            {/* Monthly */}
                            <div
                                onClick={() => setSelectedPlan('monthly')}
                                className={`grid grid-cols-3 gap-2 p-3 lg:p-4 cursor-pointer transition-colors border-b border-primary/20 ${selectedPlan === 'monthly' ? 'bg-primary/5' : 'hover:bg-primary/5'
                                    }`}
                            >
                                <span className="font-medium text-sm lg:text-base">Monthly</span>
                                <span className="font-bold text-center text-sm lg:text-base">{product.pricing.monthly.price}</span>
                                <span className="text-right text-text-secondary text-sm lg:text-base">{product.pricing.monthly.label}</span>
                            </div>

                            {/* 6 Months */}
                            <div
                                onClick={() => setSelectedPlan('sixMonths')}
                                className={`grid grid-cols-3 gap-2 p-3 lg:p-4 cursor-pointer transition-colors border-b border-primary/20 ${selectedPlan === 'sixMonths' ? 'bg-primary/5' : 'hover:bg-primary/5'
                                    }`}
                            >
                                <span className="font-medium text-sm lg:text-base">6 Months</span>
                                <span className="font-bold text-center text-sm lg:text-base">{product.pricing.sixMonths.price}</span>
                                <div className="text-right flex justify-end items-center gap-2">
                                    <span className="text-text-secondary text-sm lg:text-base">{product.pricing.sixMonths.label}</span>
                                    <span className="text-[10px] border border-primary text-primary px-1 py-0.5 rounded">20%</span>
                                </div>
                            </div>

                            {/* Yearly */}
                            <div
                                onClick={() => setSelectedPlan('yearly')}
                                className={`grid grid-cols-3 gap-2 p-3 lg:p-4 cursor-pointer transition-colors ${selectedPlan === 'yearly' ? 'bg-primary/5' : 'hover:bg-primary/5'
                                    }`}
                            >
                                <span className="font-medium text-sm lg:text-base">Yearly</span>
                                <span className="font-bold text-center text-sm lg:text-base">{product.pricing.yearly.price}</span>
                                <div className="text-right flex justify-end items-center gap-2">
                                    <span className="text-text-secondary text-sm lg:text-base">{product.pricing.yearly.label}</span>
                                    <span className="text-[10px] border border-primary text-primary px-1 py-0.5 rounded">30%</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm font-handwritten text-text-secondary mb-8 text-lg lg:text-xl">
                            Product category
                        </div>

                        <div className="border-b border-primary/30 mb-8"></div>

                        {/* Variants / Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 lg:gap-8 mb-12">
                            <div className="flex-shrink-0">
                                <label className="block text-sm font-handwritten text-base lg:text-lg mb-2">Variants available</label>
                                <div className="flex items-center border-2 border-primary rounded-full px-2 w-28 lg:w-32 justify-between">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-primary text-xl font-bold hover:bg-primary/10 rounded-full transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="font-medium text-base lg:text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-primary text-xl font-bold hover:bg-primary/10 rounded-full transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Button
                                    className="px-6 lg:px-8 py-5 lg:py-6 rounded-full font-handwritten text-lg lg:text-xl"
                                    onClick={() => {
                                        setShowToast(true);
                                        // In a real app, dispatch to Redux here
                                    }}
                                >
                                    Add to cart
                                </Button>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="space-y-4 text-sm font-handwritten text-base lg:text-lg text-text-secondary">
                            <p>Terms and conditions</p>
                            <p>30 day money back guarantee</p>
                            <p>shipping 2-3 Business days</p>
                        </div>
                    </div>
                </div>

                <Toast
                    message="ur product has been added"
                    isVisible={showToast}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </div>
    );
};

export default ProductDetails;