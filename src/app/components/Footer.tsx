import { Link } from "react-router";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-[#0B1F3A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo
                logoClassName="h-10 w-10"
                textClassName="text-lg text-white"
                subtitle="Medical Readiness Platform"
                subtitleClassName="text-gray-300"
              />
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Helping defence aspirants check their medical fitness and prepare
              for their dream career.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#D4AF37]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/medical-check"
                  className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Medical Check
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Articles
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Exams */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#D4AF37]">Defence Exams</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">NDA Exam</li>
              {/* <li className="text-sm text-gray-300">CDS Exam</li>
              <li className="text-sm text-gray-300">Agniveer Recruitment</li> */}
              <li className="text-sm text-gray-300">AFCAT</li>
              <li className="text-sm text-gray-300">Indian Navy SSR</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#D4AF37]">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>workwithshiv@gmail.com</span>
              </li>
              {/* <li className="flex items-start gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span></span>
              </li> */}
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-xs text-yellow-200 leading-relaxed">
              <strong>Disclaimer:</strong> This is not a medical diagnosis or
              certification. The fitness check provided on this platform is for
              informational and guidance purposes only. Please consult a
              certified medical professional or official defence medical board
              for accurate assessment and diagnosis.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 DefenceFit. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
