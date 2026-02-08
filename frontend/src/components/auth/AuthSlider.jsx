import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Quote } from 'lucide-react';

const slides = [
    {
        id: 1,
        type: 'overview',
        title: "SMERP ERP Solution",
        description: "Streamline your construction projects with our comprehensive management system. From structures to pour sessions, we've got you covered.",
        stats: [
            { label: "Structures", value: "29", icon: "🏢" },
            { label: "Pour Sessions", value: "12", icon: "📋" }
        ]
    },
    {
        id: 2,
        type: 'growth',
        title: "Accelerate Your Business",
        description: "Visualize your success with real-time analytics. Watch your efficiency and revenue grow day by day.",
        stats: [
            { label: "Efficiency", value: "+45%", icon: "⚡" },
            { label: "Revenue", value: "+120%", icon: "💰" }
        ]
    },
    {
        id: 3,
        type: 'review',
        title: "Trusted by Industry Leaders",
        description: "Don't just take our word for it. See what our clients have to say about their experience with SMERP.",
        review: {
            text: "This platform completely transformed our workflow. The construction management features are unparalleled.",
            author: "Sarah Johnson",
            role: "Project Director, Skyline Builders",
            rating: 5
        }
    }
];

const AuthSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const renderSlideContent = (slide, isActive) => {
        switch (slide.type) {
            case 'growth':
                return (
                    <div className="flex flex-col items-center justify-end h-full w-full pb-4 px-4">
                        <div className="flex items-end gap-4 h-48 w-full justify-center mb-6">
                            {/* Animated Bars */}
                            {/* Bar 1 */}
                            <div className="w-12 bg-primary/10 rounded-t-lg h-1/4 relative overflow-hidden">
                                <div className={`absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-1000 ease-out ${isActive ? 'h-full opacity-50' : 'h-0 opacity-0'}`}></div>
                            </div>
                            {/* Bar 2 */}
                            <div className="w-12 bg-primary/10 rounded-t-lg h-2/4 relative overflow-hidden">
                                <div className={`absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-1000 delay-100 ease-out ${isActive ? 'h-full opacity-70' : 'h-0 opacity-0'}`}></div>
                            </div>
                            {/* Bar 3 */}
                            <div className="w-12 bg-primary/10 rounded-t-lg h-3/4 relative overflow-hidden">
                                <div className={`absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-1000 delay-200 ease-out ${isActive ? 'h-full opacity-90' : 'h-0 opacity-0'}`}></div>
                            </div>
                            {/* Bar 4 */}
                            <div className="w-12 bg-primary/10 rounded-t-lg h-full relative overflow-hidden shadow-lg shadow-primary/20">
                                <div className={`absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-1000 delay-300 ease-out ${isActive ? 'h-full' : 'h-0'}`}></div>
                                {/* Upward Arrow */}
                                <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4'}`}>
                                    <TrendingUp className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {slide.stats.map((stat, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'review':
                return (
                    <div className="flex flex-col justify-center h-full p-6">
                        <div className={`bg-primary/5 p-6 rounded-2xl border border-primary/10 relative transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                            <p className="text-gray-700 italic text-lg mb-6 pt-6 relative z-10 text-center">
                                "{slide.review.text}"
                            </p>
                            <div className="flex flex-col items-center">
                                <div className="flex gap-1 mb-2">
                                    {[...Array(slide.review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <h4 className="font-bold text-gray-900">{slide.review.author}</h4>
                                <span className="text-xs text-gray-500">{slide.review.role}</span>
                            </div>
                        </div>
                    </div>
                );

            default: // overview
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-6 bg-gray-50/50 flex flex-col gap-4 justify-center">
                            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                                        SM
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">SMERP ERP</h4>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">v2.0.0</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {slide.stats?.map((stat, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center">
                                            <span className="text-2xl mb-1">{stat.icon}</span>
                                            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                                            <span className="text-xs text-gray-500">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="relative h-full w-full overflow-hidden bg-gray-50 flex flex-col justify-center items-center p-8 lg:p-12">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 opacity-30">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md h-[550px]">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                            index === currentSlide 
                                ? 'opacity-100 translate-x-0 scale-100' 
                                : index < currentSlide 
                                    ? 'opacity-0 -translate-x-12 scale-95' 
                                    : 'opacity-0 translate-x-12 scale-95'
                        }`}
                    >
                        {/* Card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-2xl border border-white/50 h-full flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="p-8 pb-4 text-center">
                                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    {slide.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed px-4">
                                    {slide.description}
                                </p>
                            </div>

                            {/* Dynamic Content */}
                            <div className="flex-1 relative overflow-hidden">
                                {renderSlideContent(slide, index === currentSlide)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="relative z-10 flex gap-2 mt-8">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AuthSlider;
