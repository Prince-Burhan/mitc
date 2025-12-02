import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import Button from '../../components/ui/Button';

const ContactPage = () => {
  const storeInfo = {
    name: 'MITC Store',
    address: 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir 190019',
    phone: '+91-1234567890',
    email: 'info@mitc.com',
    whatsapp: 'https://wa.me/911234567890',
    instagram: 'https://instagram.com/mitcstore',
    facebook: 'https://facebook.com/mitcstore',
    hours: 'Monday - Saturday: 10:00 AM - 8:00 PM',
    closedDay: 'Sunday: Closed',
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Visit our store or reach out to us through any of the channels below
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Store Location</h3>
                <p className="text-gray-600 dark:text-gray-400">{storeInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Phone className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Phone</h3>
                <a
                  href={`tel:${storeInfo.phone}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                >
                  {storeInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Mail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email</h3>
                <a
                  href={`mailto:${storeInfo.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600"
                >
                  {storeInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Business Hours</h3>
                <p className="text-gray-600 dark:text-gray-400">{storeInfo.hours}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{storeInfo.closedDay}</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Connect With Us</h3>
              <div className="flex items-center gap-3">
                <a
                  href={storeInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a
                  href={storeInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href={storeInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Map or CTA */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <MapPin className="h-16 w-16 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Visit Our Showroom
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Come see our collection of premium laptops in person. Our expert team is ready to help you find the
              perfect device for your needs.
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(storeInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                Get Directions
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;