import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Star, Plus, Minus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ZoomIn, Ruler } from 'lucide-react';
import { getProductById, MOCK_PRODUCTS } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';
import { FrequentlyBoughtTogether } from '../components/FrequentlyBoughtTogether';
import { CustomerQA } from '../components/CustomerQA';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: 'John D.',
    rating: 5,
    date: '2 weeks ago',
    title: 'Excellent product!',
    content: 'This product exceeded my expectations. Quality is top-notch and delivery was fast.',
    verified: true,
  },
  {
    id: 2,
    author: 'Sarah M.',
    rating: 4,
    date: '1 month ago',
    title: 'Great value for money',
    content: 'Really happy with this purchase. Works exactly as described.',
    verified: true,
  },
  {
    id: 3,
    author: 'Michael R.',
    rating: 5,
    date: '2 months ago',
    title: 'Highly recommend',
    content: 'Best purchase I\'ve made this year. Will definitely buy again!',
    verified: true,
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
  });

  // Image Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  
  // Size Guide Modal State
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = id ? getProductById(id) : null;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Initialize selected size and color
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] rounded-md font-semibold transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Add product to recently viewed
  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product.id, addToRecentlyViewed]); // Only depend on product.id, not the whole object

  // Generate mock images (in real app, product would have multiple images)
  const images = [product.image, product.image, product.image, product.image];

  // Generate color variant images - show the same product with different color indicators
  const colorVariants = product.colors && product.colors.length > 0
    ? product.colors.map(color => ({
        ...color,
        image: product.image, // In real app, this would be the actual colored product image
      }))
    : [{ name: 'Default', hex: '#808080', image: product.image }];

  // Get related products (same category, exclude current product)
  const relatedProducts = MOCK_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    const sizeColorText = selectedSize || selectedColor 
      ? ` (${[selectedSize, selectedColor].filter(Boolean).join(', ')})`
      : '';
    toast.success(`${quantity} ${product.name}${sizeColorText} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  // Image Zoom Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  // Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const review: Review = {
      id: reviews.length + 1,
      author: 'You',
      rating: newReview.rating,
      date: 'Just now',
      title: newReview.title,
      content: newReview.content,
      verified: true,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: '', content: '' });
    setShowReviewForm(false);
    toast.success('Review submitted successfully!');
  };

  // Share Handler
  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}`,
      url: window.location.href,
    };

    // Check if Web Share API is available (mainly mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled or error occurred
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-accent">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery with Zoom */}
          <div>
            <motion.div
              ref={imageRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-card rounded-lg border border-border overflow-hidden mb-4 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&q=80';
                  }}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />
              </div>
              {product.discount && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-semibold z-10">
                  -{product.discount}% OFF
                </div>
              )}
              {isZoomed && (
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10">
                  <ZoomIn className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery - Show Color Variants */}
            <div className="grid grid-cols-4 gap-2">
              {colorVariants.slice(0, 4).map((colorVariant, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedColor(colorVariant.name);
                    setSelectedImage(index);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                    selectedColor === colorVariant.name
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <img
                    src={colorVariant.image}
                    alt={`${product.name} - ${colorVariant.name}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Color Indicator Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: colorVariant.hex }}
                    />
                  </div>
                  {/* Selected Color Badge */}
                  {selectedColor === colorVariant.name && (
                    <div className="absolute bottom-1 left-1 right-1 bg-accent text-[#131921] text-xs py-0.5 px-1 rounded text-center font-semibold">
                      {colorVariant.name}
                    </div>
                  )}
                  {/* Color Name on Hover */}
                  <div className="absolute top-1 left-1 right-1 bg-black/70 text-white text-xs py-0.5 px-1 rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {colorVariant.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {product.brand && (
              <div className="text-accent text-sm mb-2">{product.brand}</div>
            )}
            
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#FF9900] text-[#FF9900]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-destructive">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discount && (
                <div className="text-sm text-destructive font-semibold">
                  You save ${(product.price - discountedPrice).toFixed(2)} ({product.discount}%)
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">About this item</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock && product.stock > 0 ? (
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="text-destructive font-semibold">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-2 hover:bg-muted transition-colors"
                  disabled={quantity >= (product.stock || 99)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold">Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-background"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 px-4 py-2 border border-border rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <Ruler className="h-4 w-4" />
                  <span>Size Guide</span>
                </button>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="font-semibold">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-background"
                >
                  {product.colors.map(color => (
                    <option key={color.name} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white py-3 px-6 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#131921] dark:bg-white text-white dark:text-[#131921] hover:bg-[#232f3e] dark:hover:bg-gray-200 py-3 px-6 rounded-md font-semibold transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 border ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 dark:bg-red-950'
                    : 'border-border hover:bg-muted'
                } py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    inWishlist ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 border border-border hover:bg-muted py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-xs font-semibold">Free Shipping</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-xs font-semibold">Secure Payment</div>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-xs font-semibold">Easy Returns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <div className="max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white px-6 py-2 rounded-md font-semibold transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmitReview}
                className="bg-card rounded-lg border border-border p-6 mb-6 overflow-hidden"
              >
                <h3 className="font-semibold mb-4">Write Your Review</h3>
                
                {/* Star Rating Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            star <= newReview.rating
                              ? 'fill-[#FF9900] text-[#FF9900]'
                              : 'text-gray-300 dark:text-gray-600 hover:text-[#FF9900]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    placeholder="Sum up your experience"
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-background"
                    required
                  />
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Review</label>
                  <textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    placeholder="Share your thoughts about this product"
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-background"
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white px-6 py-2 rounded-md font-semibold transition-colors"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="border border-border hover:bg-muted px-6 py-2 rounded-md font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          
          {/* Review Summary */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{product.rating}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#FF9900] text-[#FF9900]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {reviews.length} reviews
                </div>
              </div>
              
              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-2 mb-2">
                    <span className="text-sm w-12">{stars} star</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF9900]"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.author}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-[#FF9900] text-[#FF9900]'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{review.title}</h3>
                <p className="text-muted-foreground">{review.content}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frequently Bought Together Section */}
        {product.frequentlyBoughtWith && product.frequentlyBoughtWith.length > 0 && (
          <section className="mb-12">
            <FrequentlyBoughtTogether
              mainProduct={product}
              suggestedProducts={MOCK_PRODUCTS.filter(p =>
                product.frequentlyBoughtWith?.includes(p.id)
              ).slice(0, 3)}
            />
          </section>
        )}

        {/* Customer Q&A Section */}
        <section className="mb-12">
          <CustomerQA />
        </section>

        {/* Recently Viewed Section */}
        <RecentlyViewedSection />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </div>
  );
}