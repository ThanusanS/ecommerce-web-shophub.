import { X, Star, ShoppingCart, Heart, Truck } from 'lucide-react';
import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = () => {
    if (!isInWishlist(product.id)) {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl bg-card rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[90vh] overflow-y-auto">
              {/* Image Section */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                    -{product.discount}%
                  </div>
                )}
                {product.isPrime && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-md font-semibold text-sm">
                    Prime
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                
                {product.brand && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Brand: <span className="text-accent font-semibold">{product.brand}</span>
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#FFA41C] text-[#FFA41C]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-accent">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                {(product.freeShipping || product.deliveryDays) && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-green-600 dark:text-green-400">
                    <Truck className="h-4 w-4" />
                    {product.freeShipping && <span>FREE Shipping</span>}
                    {product.deliveryDays && (
                      <span>• Arrives in {product.deliveryDays} days</span>
                    )}
                  </div>
                )}

                {/* Stock */}
                <div className="mb-6">
                  {product.stock && product.stock > 0 ? (
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
                    {product.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-auto space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.stock || product.stock <= 0}
                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1111] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleAddToWishlist}
                    disabled={isInWishlist(product.id)}
                    className="w-full border border-border hover:bg-muted disabled:opacity-50 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="block w-full border border-accent text-accent hover:bg-accent hover:text-white py-3 rounded-lg transition-colors text-center font-semibold"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
