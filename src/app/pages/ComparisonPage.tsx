import { useComparison } from '../contexts/ComparisonContext';
import { Link } from 'react-router';
import { X, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function ComparisonPage() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();

  if (comparisonList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No products to compare</h2>
          <p className="text-muted-foreground mb-6">
            Add products to comparison from the product listing page
          </p>
          <Link
            to="/products"
            className="inline-block bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (productId: string) => {
    const product = comparisonList.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Compare Products</h1>
            <p className="text-muted-foreground">
              Compare up to 4 products side by side
            </p>
          </div>
          <button
            onClick={clearComparison}
            className="text-sm text-destructive hover:text-destructive/80 font-semibold transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left font-semibold sticky left-0 bg-card z-10 min-w-[200px]">
                  Feature
                </th>
                {comparisonList.map((product) => (
                  <th key={product.id} className="p-4 min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => removeFromComparison(product.id)}
                        className="absolute top-0 right-0 p-1 rounded-full bg-destructive text-white hover:bg-destructive/80 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                      <Link
                        to={`/product/${product.id}`}
                        className="font-semibold hover:text-accent transition-colors line-clamp-2 text-sm"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Price</td>
                {comparisonList.map((product) => {
                  const discountedPrice = product.discount
                    ? product.price * (1 - product.discount / 100)
                    : product.price;
                  return (
                    <td key={product.id} className="p-4">
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold text-accent">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {product.discount && (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                              Save {product.discount}%
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Rating */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Rating</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
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
                      <span className="text-sm">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Brand</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.brand || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Stock */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Availability</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.stock && product.stock > 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        In Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Prime */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Prime Eligible</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.isPrime ? (
                      <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Prime
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Shipping */}
              <tr className="border-b border-border hover:bg-muted/50">
                <td className="p-4 font-semibold sticky left-0 bg-card">Shipping</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    {product.freeShipping ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        FREE Shipping
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Standard</span>
                    )}
                    {product.deliveryDays && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {product.deliveryDays} days delivery
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Specifications */}
              {comparisonList.some((p) => p.specifications && p.specifications.length > 0) && (
                <>
                  <tr className="bg-muted/50">
                    <td colSpan={comparisonList.length + 1} className="p-4 font-bold text-center">
                      Specifications
                    </td>
                  </tr>
                  {/* Get all unique specification labels */}
                  {Array.from(
                    new Set(
                      comparisonList.flatMap((p) =>
                        (p.specifications || []).map((s) => s.label)
                      )
                    )
                  ).map((label) => (
                    <tr key={label} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 font-semibold sticky left-0 bg-card">{label}</td>
                      {comparisonList.map((product) => {
                        const spec = product.specifications?.find((s) => s.label === label);
                        return (
                          <td key={product.id} className="p-4">
                            {spec?.value || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              )}

              {/* Action */}
              <tr>
                <td className="p-4 font-semibold sticky left-0 bg-card">Action</td>
                {comparisonList.map((product) => (
                  <td key={product.id} className="p-4">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={!product.stock || product.stock <= 0}
                      className="w-full bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1111] font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
