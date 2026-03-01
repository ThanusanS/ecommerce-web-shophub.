import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { Product, useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!', {
      description: product.name,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist', {
        description: product.name,
      });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', {
        description: product.name,
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border h-full flex flex-col">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.discount && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                -{product.discount}% OFF
              </div>
            )}
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-4 w-4 ${
                  inWishlist
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col">
            {/* Brand */}
            {product.brand && (
              <div className="text-xs text-muted-foreground mb-1">
                {product.brand}
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-accent transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#FF9900] text-[#FF9900]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3 mt-auto">
              <span className="text-lg font-bold text-foreground">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white py-2 px-4 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}