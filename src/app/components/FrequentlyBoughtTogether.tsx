import { useState } from 'react';
import { Product } from '../contexts/CartContext';
import { useCart } from '../contexts/CartContext';
import { Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  suggestedProducts: Product[];
}

export function FrequentlyBoughtTogether({
  mainProduct,
  suggestedProducts,
}: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set([mainProduct.id, ...suggestedProducts.slice(0, 2).map((p) => p.id)])
  );

  const allProducts = [mainProduct, ...suggestedProducts];

  const toggleProduct = (productId: string) => {
    // Can't deselect main product
    if (productId === mainProduct.id) return;

    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const calculateTotal = () => {
    return allProducts
      .filter((p) => selectedProducts.has(p.id))
      .reduce((sum, p) => {
        const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
        return sum + price;
      }, 0);
  };

  const calculateSavings = () => {
    const original = allProducts
      .filter((p) => selectedProducts.has(p.id))
      .reduce((sum, p) => sum + p.price, 0);
    return original - calculateTotal();
  };

  const handleAddAllToCart = () => {
    const productsToAdd = allProducts.filter((p) => selectedProducts.has(p.id));
    productsToAdd.forEach((product) => {
      addToCart(product);
    });
    toast.success(`Added ${productsToAdd.length} items to cart!`);
  };

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Frequently bought together</h3>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {allProducts.slice(0, 4).map((product, index) => {
          const isSelected = selectedProducts.has(product.id);
          const isMainProduct = product.id === mainProduct.id;
          const discountedPrice = product.discount
            ? product.price * (1 - product.discount / 100)
            : product.price;

          return (
            <div key={product.id} className="relative">
              {/* Plus Icon Between Products */}
              {index > 0 && (
                <div className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-muted rounded-full">
                  <Plus className="h-4 w-4" />
                </div>
              )}

              {/* Product Card */}
              <div
                className={`border-2 rounded-lg p-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                } ${isMainProduct ? 'cursor-default' : ''}`}
                onClick={() => toggleProduct(product.id)}
              >
                {/* Checkbox */}
                <div className="flex items-start gap-2 mb-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-accent border-accent'
                        : 'border-gray-300 dark:border-gray-600'
                    } ${isMainProduct ? 'opacity-100' : ''}`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {isMainProduct ? 'This item' : 'Add-on'}
                  </span>
                </div>

                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-md mb-2"
                />

                {/* Info */}
                <h4 className="text-sm font-semibold line-clamp-2 mb-1 min-h-[2.5rem]">
                  {product.name}
                </h4>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-accent">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary and Action */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Total for {selectedProducts.size} items:
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-accent">
                ${calculateTotal().toFixed(2)}
              </span>
              {calculateSavings() > 0 && (
                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  Save ${calculateSavings().toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddAllToCart}
            disabled={selectedProducts.size === 0}
            className="w-full sm:w-auto bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1111] font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
          >
            Add {selectedProducts.size} to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
