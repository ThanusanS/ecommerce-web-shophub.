import { Search, ShoppingCart, User, Menu, Moon, Sun, Heart, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const { getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top Header Bar */}
      <div className="bg-[#131921] dark:bg-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                <span className="text-white text-lg sm:text-xl font-bold tracking-tight">
                  ShopHub
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8"
            >
              <div className="flex w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 sm:px-6 bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] rounded-r-md transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-white hover:text-[#FF9900] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Account */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center gap-2 text-white hover:text-[#FF9900] transition-colors px-2"
                  >
                    <User className="h-5 w-5" />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs">Hello, {user.name || 'User'}</div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        Account
                        {isAdmin && <Shield className="h-3 w-3" />}
                      </div>
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-white hover:text-[#FF9900] transition-colors px-2"
                >
                  <User className="h-5 w-5" />
                  <div className="hidden lg:block text-left">
                    <div className="text-xs">Hello, Sign in</div>
                    <div className="text-sm font-semibold">Account</div>
                  </div>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-2 text-white hover:text-[#FF9900] transition-colors px-2"
              >
                <Heart className="h-6 w-6" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
                <span className="hidden sm:block text-sm font-semibold">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2 text-white hover:text-[#FF9900] transition-colors px-2"
              >
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF9900] text-[#131921] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
                <span className="hidden sm:block text-sm font-semibold">Cart</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-[#FF9900] text-sm"
              />
              <button
                type="submit"
                className="px-4 bg-[#FF9900] hover:bg-[#ff8800] text-[#131921] rounded-r-md transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#232f3e] dark:bg-[#131921]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center gap-6 h-10 text-sm">
            <Link
              to="/products?category=electronics"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Electronics
            </Link>
            <Link
              to="/products?category=mens-clothing"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Men's Clothing
            </Link>
            <Link
              to="/products?category=womens-clothing"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Women's Clothing
            </Link>
            <Link
              to="/products?category=kids-clothing"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Kids' Clothing
            </Link>
            <Link
              to="/products?category=fashion"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Fashion
            </Link>
            <Link
              to="/products?category=books"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Books
            </Link>
            <Link
              to="/products?category=home"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Home & Kitchen
            </Link>
            <Link
              to="/products?category=sports"
              className="text-white hover:text-[#FF9900] transition-colors"
            >
              Sports
            </Link>
            <Link
              to="/deals"
              className="text-[#FF9900] hover:text-[#ff8800] transition-colors font-semibold"
            >
              Today's Deals
            </Link>
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2">
              <Link
                to="/products?category=electronics"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Electronics
              </Link>
              <Link
                to="/products?category=mens-clothing"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men's Clothing
              </Link>
              <Link
                to="/products?category=womens-clothing"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women's Clothing
              </Link>
              <Link
                to="/products?category=kids-clothing"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kids' Clothing
              </Link>
              <Link
                to="/products?category=fashion"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fashion
              </Link>
              <Link
                to="/products?category=books"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Books
              </Link>
              <Link
                to="/products?category=home"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home & Kitchen
              </Link>
              <Link
                to="/products?category=sports"
                className="block text-white hover:text-[#FF9900] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sports
              </Link>
              <Link
                to="/deals"
                className="block text-[#FF9900] hover:text-[#ff8800] transition-colors font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Today's Deals
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}