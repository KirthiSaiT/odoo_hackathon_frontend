import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import Toast from '../components/ui/Toast';
import { useGetProductByIdQuery } from '../services/productsApi';
import { useAddToCartMutation } from '../services/cartApi';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null); // Changed default to null
    const [quantity, setQuantity] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Fetch Product Data
    const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

    // Add to Cart Mutation
    const [addToCart] = useAddToCartMutation();

    if (isLoading) return <div className="text-center py-20">Loading product details...</div>;
    if (isError || !product) return <div className="text-center py-20 text-red-500">Product not found.</div>;

    // Prepare images array (Main + Sub)
    const images = [product.main_image, ...(product.sub_images || [])].filter(Boolean);
    // If no images, provide a placeholder or handled in UI

    // Sort recurring plans by price or some logic if needed
    const plans = product.recurring_plans || [];

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = async () => {
        try {
            await addToCart({
                product_id: parseInt(id),
                quantity: quantity,
                selected_plan_name: selectedPlan
            }).unwrap();

            setToastMessage('Product added to cart!');
            setShowToast(true);

            // Navigate to cart after 1 second
            setTimeout(() => {
                navigate('/cart');
            }, 1000);
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
                                {images.length > 1 ? (
                                    images.slice(1).map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(index + 1)}
                                            className={`aspect-square border-2 rounded-lg cursor-pointer flex items-center justify-center bg-background-paper transition-colors overflow-hidden ${selectedImage === (index + 1)
                                                ? 'border-primary'
                                                : 'border-primary/30 hover:border-primary/60'
                                                }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="aspect-square border-2 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                                        No Subs
                                    </div>
                                )}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 aspect-[4/3] border-2 border-primary rounded-lg bg-background-paper flex items-center justify-center overflow-hidden">
                                {images.length > 0 ? (
                                    <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-text-secondary text-sm lg:text-lg">No image available</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="w-full">
                        <h1 className="text-3xl lg:text-4xl font-handwritten text-primary mb-6">{product.name}</h1>
                        <div className="border-b border-primary/30 mb-6"></div>

                        {/* Pricing Table */}
                        {/* Pricing Table */}
                        <div className="border-2 border-primary rounded-xl overflow-hidden mb-6 bg-background-paper">
                            {plans.length > 0 ? (
                                plans.map((plan, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPlan(plan.plan_name)}
                                        className={`grid grid-cols-3 gap-2 p-3 lg:p-4 cursor-pointer transition-colors border-b border-primary/20 last:border-b-0 ${selectedPlan === plan.plan_name ? 'bg-primary/5' : 'hover:bg-primary/5'
                                            }`}
                                    >
                                        <span className="font-medium text-sm lg:text-base">{plan.plan_name}</span>
                                        <span className="font-bold text-center text-sm lg:text-base">${plan.price.toFixed(2)}</span>
                                        <div className="text-right flex justify-end items-center gap-2">
                                            {/* Logic for showing save % or label can be added here if needed */}
                                            <span className="text-text-secondary text-sm lg:text-base">min qty: {plan.min_qty}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 flex justify-between items-center">
                                    <span className="font-medium text-lg">One-time Purchase</span>
                                    <span className="font-bold text-xl text-primary">${product.sales_price?.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <div className="text-sm font-handwritten text-text-secondary mb-8 text-lg lg:text-xl">
                            {product.product_type}
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
                                    onClick={handleAddToCart}
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
                    message={toastMessage}
                    isVisible={showToast}
                    onClose={() => setShowToast(false)}
                />
            </div>
        </div>
    );
};

export default ProductDetails;