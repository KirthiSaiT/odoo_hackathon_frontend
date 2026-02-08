import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import Drawer from '../../components/ui/drawer';
import {
    Add,
    Delete,
    Print,
    Search,
    Save,
    // ArrowBack, // Removed
} from '@mui/icons-material';
import { useGetProductsQuery, useCreateProductMutation, useGetRecurringTemplatesQuery } from '../../services/productsApi';

import { useToast } from '../../components/ToastProvider';

const Products = () => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Changed from view state
    const [activeFormTab, setActiveFormTab] = useState('recurring'); // 'recurring' or 'variants'

    // API Hooks
    const { data: productsData, isLoading, isError, refetch } = useGetProductsQuery({
        page: 1,
        size: 50,
        search: searchTerm
    });

    // Safety check: ensure recurringTemplates is an array or default to empty array
    const { data: recurringTemplatesData } = useGetRecurringTemplatesQuery();
    const recurringTemplates = Array.isArray(recurringTemplatesData) ? recurringTemplatesData : [];

    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        product_type: 'Goods',
        sales_price: '',
        cost_price: '',
        tax: '',
        main_image: ''
    });

    // Sub Images State
    const [subImages, setSubImages] = useState(['', '', '']);

    const handleSubImageChange = (index, value) => {
        const newImages = [...subImages];
        newImages[index] = value;
        setSubImages(newImages);
    };

    // Variants State
    const [variants, setVariants] = useState([]);

    const handleAddVariant = () => {
        setVariants([...variants, { attribute: '', value: '', extra_price: '' }]);
    };

    const handleRemoveVariant = (index) => {
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    // Recurring Plans State
    const [recurringPlans, setRecurringPlans] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Auto-calculate recurring plans when sales_price or tax changes
    useEffect(() => {
        if (!recurringTemplates || recurringTemplates.length === 0 || !formData.sales_price) {
            setRecurringPlans([]);
            return;
        }

        try {
            const price = parseFloat(formData.sales_price) || 0;
            const taxString = formData.tax ? String(formData.tax).replace('%', '') : '0';
            const taxRate = parseFloat(taxString) || 0;
            const priceWithTax = price + (price * (taxRate / 100));

            const today = new Date();
            const formattedToday = today.toISOString().split('T')[0];

            const plans = recurringTemplates.map(template => {
                let endDate = null;
                const planNameLower = (template.plan_name || '').toLowerCase();
                const d = new Date(today);

                if (planNameLower.includes('monthly')) {
                    d.setMonth(d.getMonth() + 1);
                    endDate = d.toISOString().split('T')[0];
                } else if (planNameLower.includes('yearly')) {
                    d.setFullYear(d.getFullYear() + 1);
                    endDate = d.toISOString().split('T')[0];
                } else if (planNameLower.includes('quarterly')) {
                    d.setMonth(d.getMonth() + 3);
                    endDate = d.toISOString().split('T')[0];
                }

                return {
                    plan_name: template.plan_name,
                    price: priceWithTax * (template.price_multiplier || 1),
                    min_qty: 1,
                    start_date: formattedToday,
                    end_date: endDate
                };
            });

            setRecurringPlans(plans);
        } catch (err) {
            console.error("Error calculating recurring plans:", err);
            setRecurringPlans([]);
        }
    }, [formData.sales_price, formData.tax, recurringTemplates]);

    const handleSave = async () => {
        console.log("Saving product...", formData);
        if (!formData.name) return toast.error("Product Name is required");

        try {
            const payload = {
                name: formData.name,
                product_type: formData.product_type,
                sales_price: parseFloat(formData.sales_price) || 0,
                cost_price: parseFloat(formData.cost_price) || 0,
                tax: formData.tax,
                main_image: formData.main_image,
                sub_images: subImages.filter(img => img.trim() !== ''),
                recurring_plans: recurringPlans.map(plan => ({
                    plan_name: plan.plan_name,
                    price: plan.price,
                    min_qty: plan.min_qty,
                    start_date: plan.start_date ? new Date(plan.start_date).toISOString() : null,
                    end_date: plan.end_date ? new Date(plan.end_date).toISOString() : null
                })),
                variants: variants.map(v => ({
                    attribute: v.attribute,
                    value: v.value,
                    extra_price: parseFloat(v.extra_price) || 0
                }))
            };

            await createProduct(payload).unwrap();

            toast.success("Product created successfully!");
            setIsDrawerOpen(false);
            setFormData({
                name: '',
                product_type: 'Goods',
                sales_price: '',
                cost_price: '',
                tax: '',
                main_image: ''
            });
            setRecurringPlans([]);
            setVariants([]);
            setSubImages(['', '', '']);
            refetch();
        } catch (error) {
            console.error("Failed to create product", error);
            toast.error("Failed to create product: " + (error.data?.detail || error.message));
        }
    };

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const products = productsData?.items || [];

    // Calculate Profit Margin safely
    const profitMargin = (parseFloat(formData.sales_price || 0) - parseFloat(formData.cost_price || 0)).toFixed(2);

    const tabs = [
        "Subscriptions", "Products", "Reporting", "Users/Contacts", "Configuration", "My Profile"
    ];

    return (
        <div className="space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border-light pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${tab === 'Products'
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-border-light">
                <div className="flex items-center gap-3">
                    <Button onClick={handleOpenDrawer}>
                        <Add className="mr-1" style={{ fontSize: 18 }} />
                        New
                    </Button>

                    <div className="h-8 w-px bg-border-light mx-1"></div>
                    <button className="p-2 text-text-secondary hover:text-red-500 transition-colors rounded hover:bg-red-50" title="Delete">
                        <Delete style={{ fontSize: 20 }} />
                    </button>
                    <button className="p-2 text-text-secondary hover:text-primary transition-colors rounded hover:bg-primary/5" title="Print">
                        <Print style={{ fontSize: 20 }} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" style={{ fontSize: 20 }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light bg-gray-50 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg shadow border border-border-light min-h-[500px] p-6">
                {isLoading ? (
                    <div className="text-center p-10 text-gray-500">Loading products...</div>
                ) : isError ? (
                    <div className="text-center p-10 text-red-500">Error loading products.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Sales Price</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Profit Margin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                        No products found. Click "New" to create one.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                                        // Optional: Load product for editing
                                        handleOpenDrawer();
                                    }}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>${product.sales_price?.toFixed(2)}</TableCell>
                                        <TableCell className="text-text-secondary">${product.cost_price?.toFixed(2)}</TableCell>
                                        <TableCell className="text-green-600 font-medium">
                                            ${(product.profit_margin || (product.sales_price - product.cost_price))?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Product Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={formData.name || 'New Product'}
                width="max-w-4xl"
                footer={
                    <>
                        <Button variant="outline" onClick={handleCloseDrawer}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isCreating}>
                            <Save className="mr-1" style={{ fontSize: 18 }} />
                            {isCreating ? 'Saving...' : 'Save Product'}
                        </Button>
                    </>
                }
            >
                <div className="py-2">
                    {/* Product Name Header */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full text-3xl font-semibold border-b-2 border-border-light focus:border-primary outline-none py-2 placeholder-gray-300"
                            placeholder="e.g. Cheese Burger"
                        />
                    </div>

                    {/* Main Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Product Type</label>
                                <select
                                    name="product_type"
                                    value={formData.product_type}
                                    onChange={handleInputChange}
                                    className="flex-1 p-2 border border-border-light rounded focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    <option value="Goods">Goods</option>
                                    <option value="Service">Service</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Sales Price</label>
                                <input
                                    type="number"
                                    name="sales_price"
                                    value={formData.sales_price}
                                    onChange={handleInputChange}
                                    className="flex-1 p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Cost Price</label>
                                <input
                                    type="number"
                                    name="cost_price"
                                    value={formData.cost_price}
                                    onChange={handleInputChange}
                                    className="flex-1 p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Profit Margin</label>
                                <div className="flex-1 p-2 text-text-secondary">
                                    ${profitMargin}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Tax</label>
                                <input
                                    type="text"
                                    name="tax"
                                    value={formData.tax}
                                    onChange={handleInputChange}
                                    className="flex-1 p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="Ex: 15%"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Main Image URL</label>
                                <input
                                    type="text"
                                    name="main_image"
                                    value={formData.main_image}
                                    onChange={handleInputChange}
                                    className="flex-1 p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-32 text-sm font-medium text-text-primary">Sub Images</label>
                                <div className="flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={subImages[0] || ''}
                                        onChange={(e) => handleSubImageChange(0, e.target.value)}
                                        className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                        placeholder="Sub Image URL 1"
                                    />
                                    <input
                                        type="text"
                                        value={subImages[1] || ''}
                                        onChange={(e) => handleSubImageChange(1, e.target.value)}
                                        className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                        placeholder="Sub Image URL 2"
                                    />
                                    <input
                                        type="text"
                                        value={subImages[2] || ''}
                                        onChange={(e) => handleSubImageChange(2, e.target.value)}
                                        className="w-full p-2 border-b border-border-light focus:border-primary outline-none transition-colors"
                                        placeholder="Sub Image URL 3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs: Recurring Prices | Variants */}
                    <div className="mb-6">
                        <div className="flex gap-4 border-b border-border-light">
                            <button
                                className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors ${activeFormTab === 'recurring' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                                onClick={() => setActiveFormTab('recurring')}
                            >
                                Recurring Prices
                            </button>
                            <button
                                className={`px-6 py-2 font-medium text-sm border-b-2 transition-colors ${activeFormTab === 'variants' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                                onClick={() => setActiveFormTab('variants')}
                            >
                                Variants
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeFormTab === 'recurring' && (
                        <div className="border border-border-light rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>Recurring Plan</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Min qty</TableHead>
                                        <TableHead>Start date</TableHead>
                                        <TableHead>End date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recurringPlans.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                                Enter a Sales Price to see recurring plans.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recurringPlans.map((plan, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{plan.plan_name}</TableCell>
                                                <TableCell>${plan.price.toFixed(2)}</TableCell>
                                                <TableCell>{plan.min_qty}</TableCell>
                                                <TableCell>
                                                    <input
                                                        type="date"
                                                        className="bg-transparent outline-none w-full"
                                                        value={plan.start_date || ''}
                                                        onChange={(e) => {
                                                            const newPlans = [...recurringPlans];
                                                            newPlans[index].start_date = e.target.value;
                                                            setRecurringPlans(newPlans);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <input
                                                        type="date"
                                                        className="bg-transparent outline-none w-full"
                                                        value={plan.end_date || ''}
                                                        onChange={(e) => {
                                                            const newPlans = [...recurringPlans];
                                                            newPlans[index].end_date = e.target.value;
                                                            setRecurringPlans(newPlans);
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {activeFormTab === 'variants' && (
                        <div className="border border-border-light rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>Attribute</TableHead>
                                        <TableHead>Values</TableHead>
                                        <TableHead>Extra Price</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variants.map((variant, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Size"
                                                    className="bg-transparent outline-none w-full border-b border-transparent focus:border-primary"
                                                    value={variant.attribute}
                                                    onChange={(e) => handleVariantChange(index, 'attribute', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Large"
                                                    className="bg-transparent outline-none w-full border-b border-transparent focus:border-primary"
                                                    value={variant.value}
                                                    onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="bg-transparent outline-none w-full border-b border-transparent focus:border-primary"
                                                    value={variant.extra_price}
                                                    onChange={(e) => handleVariantChange(index, 'extra_price', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    onClick={() => handleRemoveVariant(index)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <Delete style={{ fontSize: 18 }} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Button
                                                variant="ghost"
                                                className="text-primary hover:bg-primary/5 w-full justify-start"
                                                onClick={handleAddVariant}
                                            >
                                                <Add className="mr-2" style={{ fontSize: 18 }} />
                                                Add Line
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default Products;
