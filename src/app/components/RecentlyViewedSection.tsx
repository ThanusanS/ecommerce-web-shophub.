import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { ProductCard } from './ProductCard';

export function RecentlyViewedSection() {
  const { recentlyViewed } = useRecentlyViewed();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Recently Viewed</h2>
        <span className="text-sm text-muted-foreground">
          {recentlyViewed.length} {recentlyViewed.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {recentlyViewed.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
