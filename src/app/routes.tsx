import { createBrowserRouter, Outlet } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import ComparisonPage from './pages/ComparisonPage';
import NotFoundPage from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { ComparisonProvider } from './contexts/ComparisonContext';

// Root component that wraps all routes with providers
function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <ComparisonProvider>
              <Outlet />
            </ComparisonProvider>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/signup',
        Component: SignupPage,
      },
      {
        path: '/admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: '/',
        Component: Layout,
        children: [
          {
            index: true,
            Component: HomePage,
          },
          {
            path: 'products',
            Component: ProductListingPage,
          },
          {
            path: 'product/:id',
            Component: ProductDetailPage,
          },
          {
            path: 'cart',
            Component: CartPage,
          },
          {
            path: 'checkout',
            Component: CheckoutPage,
          },
          {
            path: 'wishlist',
            Component: WishlistPage,
          },
          {
            path: 'compare',
            Component: ComparisonPage,
          },
          {
            path: 'deals',
            Component: ProductListingPage,
          },
          // Fallback routes for footer/header links (would be implemented in real app)
          {
            path: '*',
            Component: NotFoundPage,
          },
        ],
      },
    ],
  },
]);