import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import { MOCK_PRODUCTS } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'New Electronics Collection',
    subtitle: 'Discover the latest in tech innovation',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80',
    cta: 'Shop Now',
    link: '/products?category=electronics',
  },
  {
    id: 2,
    title: 'Fashion Sale - Up to 50% Off',
    subtitle: 'Upgrade your wardrobe with premium styles',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
    cta: 'Explore Deals',
    link: '/products?category=fashion',
  },
  {
    id: 3,
    title: 'Home Essentials',
    subtitle: 'Transform your space with quality products',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80',
    cta: 'Discover More',
    link: '/products?category=home',
  },
];

const CATEGORIES = [
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
    link: '/products?category=electronics',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80',
    link: '/products?category=fashion',
  },
  {
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80',
    link: '/products?category=books',
  },
  {
    name: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500&q=80',
    link: '/products?category=home',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80',
    link: '/products?category=sports',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Countdown Timer State (24-hour countdown starting from 24 hours)
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          // Reset to 24 hours when countdown reaches 0
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const featuredProducts = MOCK_PRODUCTS.slice(0, 8);
  const dealProducts = MOCK_PRODUCTS.filter((p) => p.discount).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-muted">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
              <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="max-w-xl text-white ml-8 sm:ml-12 lg:ml-16">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                  >
                    {HERO_SLIDES[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className="text-lg sm:text-xl md:text-2xl mb-8"
                  >
                    {HERO_SLIDES[currentSlide].subtitle}
                  </motion.p>
                  <motion.a
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    href={HERO_SLIDES[currentSlide].link}
                    className="inline-block bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] font-semibold px-8 py-3 rounded-md transition-colors"
                  >
                    {HERO_SLIDES[currentSlide].cta}
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 dark:bg-black/60 hover:bg-white/90 dark:hover:bg-black/90 p-2 rounded-full transition-colors z-10 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black p-2 rounded-full transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-[#FF9900] w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Categories Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                image={category.image}
                link={category.link}
              />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Deal of the Day */}
        <section className="bg-gradient-to-r from-[#131921] to-[#232f3e] dark:from-[#0a0a0a] dark:to-[#131921] rounded-2xl p-6 md:p-8 lg:p-12 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Deal of the Day
              </h2>
              <p className="text-gray-300">
                Limited time offers - Don't miss out!
              </p>
            </div>
            <div className="mt-4 sm:mt-0 bg-[#FF9900] text-[#131921] px-6 py-3 rounded-lg font-semibold">
              Ends in {formatTime(timeRemaining)}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">
              On orders over $50
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">
              100% secure transactions
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">
              30-day return policy
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Customer support anytime
            </p>
          </div>
        </section>

        {/* Recently Viewed Section */}
        <RecentlyViewedSection />
      </div>
    </div>
  );
}