
import { Button } from "@/components/ui/button";
import { Ship, Menu, LogIn, LogOut, User, Shield, Settings, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, hasPermission } = useAuth();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Tracking", href: "/tracking" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Loyalty", href: "/loyalty" },
    { name: "Feedback", href: "/feedback" },
  ];

  const handleLogout = () => {
    logout();
    // Redirect to home after logout
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-ocean rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-freight">SkyShip Logistics</h1>
                <p className="text-xs text-muted-foreground">Global Freight Solutions</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-freight transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/tracking">
              <Button variant="outline" className="btn-secondary">
                Track Shipment
              </Button>
            </Link>
            <Link to="/quote">
              <Button className="btn-primary">
                Get Quote
              </Button>
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700">
                    Welcome, {user?.firstName || user?.name}!
                  </span>
                  {hasPermission("canAccessAdmin") && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="text-gray-700 hover:text-red-600 hover:border-red-600"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-freight hover:bg-freight-light rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-freight transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Contact Info */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Us</h3>
                <div className="space-y-2 text-sm">
                  <a href="tel:+15551234567" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    +1 (555) 123-4567
                  </a>
                  <a href="https://wa.me/15551234567" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Chat
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-4">
                <Link to="/tracking" className="w-full">
                  <Button variant="outline" className="btn-secondary w-full">
                    Track Shipment
                  </Button>
                </Link>
                <Link to="/quote" className="w-full">
                  <Button className="btn-primary w-full">
                    Get Quote
                  </Button>
                </Link>
                
                {/* Mobile Auth Button */}
                {isAuthenticated ? (
                  <Button variant="outline" onClick={handleLogout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" className="w-full">
                      <Button variant="outline" className="w-full">
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
