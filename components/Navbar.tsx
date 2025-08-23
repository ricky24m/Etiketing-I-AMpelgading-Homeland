import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';

interface NavbarProps {
  variant?: 'default' | 'booking';
  onCartClick?: () => void;
}

export default function Navbar({ variant = 'default', onCartClick }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (variant === 'default') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${variant === 'booking'
    ? 'bg-green-800/95 backdrop-blur-sm shadow-lg'
    : isScrolled
      ? 'bg-green-800/95 backdrop-blur-sm shadow-lg'
      : 'bg-transparent backdrop-blur-sm'
    }`;

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/images/Logoo.png"
                alt="I'AMpel GADING Logo"
                className="h-12 lg:h-16 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <Link href="/" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Beranda
              </Link>
              <Link href="/#galeri" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Galeri
              </Link>
              <Link href="/#testimonials" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Testimoni
              </Link>
              <Link href="/#contact" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Hubungi Kami
              </Link>
              <Link href="/katalog" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Booking
              </Link>
              <Link href="/panduan" className="text-white hover:text-green-300 transition-colors duration-200 font-medium">
                Panduan
              </Link>
            </div>

            {/* Auth & Cart Section */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">
                    Halo, {user.nama_lengkap.split(' ')[0]}
                  </span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userData');
                      setUser(null);
                      window.location.reload();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex lg:items-center lg:space-x-4">
                  <button
                    onClick={() => {
                      setAuthType('login');
                      setShowAuth(true);
                    }}
                    className="text-white hover:text-green-300 transition-colors duration-200 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthType('register');
                      setShowAuth(true);
                    }}
                    className="hover:text-green-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Daftar
                  </button>
                </div>
              )}

              {onCartClick && (
                <button
                  onClick={onCartClick}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l-2.5-2.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                  </svg>
                  <span>Keranjang</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-green-300 focus:outline-none focus:text-green-300 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-green-800/95 backdrop-blur-sm rounded-lg mt-2">
                <Link
                  href="/"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/#galeri"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Galeri
                </Link>
                <Link
                  href="/#testimonials"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimoni
                </Link>
                <Link
                  href="/#contact"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hubungi Kami
                </Link>
                <Link
                  href="/katalog"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Booking
                </Link>
                <Link
                  href="/panduan"
                  className="block px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panduan
                </Link>

                {/* Mobile Auth Section */}
                <div className="border-t border-green-700 pt-3 mt-3">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-white font-medium">
                        Halo, {user.nama_lengkap.split(' ')[0]}
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('userData');
                          setUser(null);
                          window.location.reload();
                        }}
                        className="block w-full text-left px-3 py-2 text-white hover:bg-red-600 rounded-md transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowAuth(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-white hover:text-green-300 hover:bg-green-700/50 rounded-md transition-colors duration-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setShowAuth(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
                      >
                        Daftar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultType={authType} />
    </>
  );
}