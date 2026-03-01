import { Link, useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'motion/react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const discountedPrice = item.discount
                ? item.price * (1 - item.discount / 100)
                : item.price;

              return (
                <motion.div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-lg border border-border p-4 sm:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="shrink-0 w-24 h-24 sm:w-32 sm:h-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="hover:text-accent transition-colors"
                      >
                        <h3 className="font-semibold mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      
                      {item.brand && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Brand: {item.brand}
                        </p>
                      )}

                      {/* Size and Color Display */}
                      {(item.selectedSize || item.selectedColor) && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.selectedSize && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-lg font-bold">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {item.discount && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-2 hover:bg-muted transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            className="p-2 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition-colors text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>

                        {/* Subtotal */}
                        <div className="sm:ml-auto">
                          <span className="text-sm text-muted-foreground">Subtotal: </span>
                          <span className="font-bold">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white py-3 px-6 rounded-md font-semibold transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block w-full text-center border border-border hover:bg-muted py-3 px-6 rounded-md font-semibold transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="text-green-600 dark:text-green-400">✓</div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-green-600 dark:text-green-400">✓</div>
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-green-600 dark:text-green-400">✓</div>
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}