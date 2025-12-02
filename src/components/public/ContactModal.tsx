import { useState } from 'react';
import { X, MessageCircle, Instagram, Mail, Facebook, Phone } from 'lucide-react';
import { Modal, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import { WhatsAppTemplate } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productUrl?: string;
}

const ContactModal = ({ isOpen, onClose, productTitle, productUrl }: ContactModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  // In real app, these would come from SiteSettings
  const whatsappNumber = '911234567890';
  const instagramUrl = 'https://instagram.com/mitcstore';
  const facebookUrl = 'https://facebook.com/mitcstore';
  const email = 'info@mitc.com';
  const phone = '+91-1234567890';

  const templates: WhatsAppTemplate[] = [
    {
      id: '1',
      name: 'General Inquiry',
      message: `Hi, I'm interested in [Product Title]. Is it available?`,
      isDefault: true,
    },
    {
      id: '2',
      name: 'Price Details',
      message: `Can I get more details about [Product Title]? What's the best price you can offer?`,
      isDefault: false,
    },
    {
      id: '3',
      name: 'Visit Store',
      message: `I'd like to visit your store to see [Product Title]. When are you open?`,
      isDefault: false,
    },
    {
      id: '4',
      name: 'Warranty Info',
      message: `What warranty do you provide for [Product Title]?`,
      isDefault: false,
    },
    {
      id: '5',
      name: 'Specifications',
      message: `Can you share the full specifications of [Product Title]?`,
      isDefault: false,
    },
    {
      id: '6',
      name: 'Customization',
      message: `Is it possible to customize [Product Title] with different specs?`,
      isDefault: false,
    },
    {
      id: '7',
      name: 'Trade-In',
      message: `Do you accept trade-ins? I'm interested in [Product Title].`,
      isDefault: false,
    },
    {
      id: '8',
      name: 'Bulk Order',
      message: `I need multiple units of [Product Title]. Can you offer a bulk discount?`,
      isDefault: false,
    },
    {
      id: '9',
      name: 'Payment Options',
      message: `What payment options do you accept for [Product Title]?`,
      isDefault: false,
    },
    {
      id: '10',
      name: 'Delivery',
      message: `Do you provide delivery for [Product Title]? What are the charges?`,
      isDefault: false,
    },
  ];

  const getMessage = () => {
    return templates[selectedTemplate].message.replace('[Product Title]', productTitle);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(getMessage());
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${productTitle}`);
    const body = encodeURIComponent(getMessage());
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Store" size="lg">
      <div className="space-y-6">
        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </button>
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </a>
          <button
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Mail className="h-5 w-5" />
            Email
          </button>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
          >
            <Instagram className="h-5 w-5" />
            Instagram
          </a>
        </div>

        {/* WhatsApp Templates */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Choose a WhatsApp Message Template
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {templates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                  selectedTemplate === index
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">{template.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {template.message.replace('[Product Title]', productTitle)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview Message:
          </p>
          <p className="text-gray-900 dark:text-gray-100">{getMessage()}</p>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleWhatsApp} leftIcon={<MessageCircle />}>
          Send via WhatsApp
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactModal;