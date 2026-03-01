import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';
import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function WishlistPage() {
  const { wishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const isEmpty = getWishlistCount() === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {getWishlistCount()} {getWishlistCount() === 1 ? 'item' : 'items'}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="bg-muted rounded-full p-8 mb-6">
              <Heart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Save your favorite items to your wishlist and shop them later.
            </p>
            <Link
              to="/products"
              className="bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
