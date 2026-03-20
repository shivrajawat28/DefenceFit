import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import BrandLogo from "./BrandLogo";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", isActive: location.pathname === "/" && !location.hash },
    {
      name: "About",
      path: "/#about",
      isActive: location.pathname === "/" && location.hash === "#about",
    },
    {
      name: "Medical Check",
      path: "/medical-check",
      isActive: location.pathname === "/medical-check",
    },
    {
      name: "Articles",
      path: "/articles",
      isActive: location.pathname === "/articles",
    },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo
              logoClassName="h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-105"
              textClassName="text-lg md:text-xl text-[#2E4A3F] transition-colors group-hover:text-[#1f5c34]"
              subtitle="Medical Readiness Platform"
              subtitleClassName="text-[#0B1F3A]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-[#2E4A3F] ${
                  link.isActive
                    ? "text-[#2E4A3F]"
                    : "text-gray-700"
                }`}
              >
                {link.name}
                {link.isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]"
                    layoutId="activeNav"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B1F3A] transition-all hover:shadow-lg hover:scale-105"
            >
              <Link to="/medical-check">Start Check</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2E4A3F] hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    link.isActive
                      ? "bg-[#2E4A3F] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                asChild
                className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0B1F3A]"
              >
                <Link
                  to="/medical-check"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                >
                  Start Check
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
