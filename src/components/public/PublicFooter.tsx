import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFooter = () => {
  // In real app, this would come from SiteSettings
  const storeInfo = {
    name: 'MITC Store',
    slogan: 'Premium Laptops for Everyone',
    phone: '+91-1234567890',
    email: 'info@mitc.com',
    address: 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir 190019',
    whatsapp: 'https://wa.me/911234567890',
    instagram: 'https://instagram.com/mitcstore',
    facebook: 'https://facebook.com/mitcstore',
    youtube: 'https://youtube.com/@mitcstore',
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Return Policy', path: '/returns' },
    { name: 'Warranty Info', path: '/warranty' },
  ];

  const categories = [
    { name: 'Premium Laptops', path: '/products?category=Premium' },
    { name: 'Standard Laptops', path: '/products?category=Standard' },
    { name: 'Basic Laptops', path: '/products?category=Basic' },
    { name: 'New Arrivals', path: '/products?filter=new' },
    { name: 'Deals', path: '/products?filter=deals' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{storeInfo.name}</h3>
                <p className="text-xs text-gray-400">{storeInfo.slogan}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted destination for premium laptops in Kashmir. Quality products, competitive prices, and excellent customer service.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={storeInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={storeInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={storeInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={storeInfo.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{storeInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href={`tel:${storeInfo.phone}`} className="text-sm hover:text-primary-400">
                  {storeInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <a href={`mailto:${storeInfo.email}`} className="text-sm hover:text-primary-400">
                  {storeInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {storeInfo.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;