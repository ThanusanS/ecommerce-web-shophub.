import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { CreditCard, Wallet, Building2, Check } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Check className="h-12 w-12 text-green-600 dark:text-green-300" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-muted-foreground mb-8">
            Order confirmation has been sent to your email.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white py-3 px-6 rounded-md font-semibold transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-border hover:bg-muted py-3 px-6 rounded-md font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.fullName}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, address: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Country *
                    </label>
                    <select
                      required
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-accent"
                    />
                    <CreditCard className="h-5 w-5" />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'paypal'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="accent-accent"
                    />
                    <Wallet className="h-5 w-5" />
                    <span className="font-semibold">PayPal</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-md cursor-pointer transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-accent bg-accent/5'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="accent-accent"
                    />
                    <Building2 className="h-5 w-5" />
                    <span className="font-semibold">Bank Transfer</span>
                  </label>
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardInfo.cardNumber}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardInfo.cardName}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, cardName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardInfo.expiryDate}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, expiryDate: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardInfo.cvv}
                          onChange={(e) =>
                            setCardInfo({ ...cardInfo, cvv: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => {
                    const discountedPrice = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;

                    return (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold">
                            ${(discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pt-6 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-border">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  className="w-full bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] dark:text-white py-3 px-6 rounded-md font-semibold transition-colors"
                >
                  Place Order
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  🔒 Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
