import { Customer } from '../types';
import { isWarrantyActive, formatDate } from './formatters';

// Notification templates
export const notificationTemplates = {
  warrantyReminder: (customer: Customer) => `
Hi ${customer.name},

This is a friendly reminder that your ${customer.productDetails.title} warranty will expire on ${formatDate(customer.warrantyEndDate)}.

If you're experiencing any issues, please contact us before the warranty ends.

Best regards,
MITC Team
  `.trim(),

  warrantyExpired: (customer: Customer) => `
Hi ${customer.name},

Your ${customer.productDetails.title} 15-day testing warranty has now expired.

We hope you're enjoying your laptop! We'd love to hear your feedback.

Please take a moment to share your experience: [Review Link]

Best regards,
MITC Team
  `.trim(),

  reviewRequest: (customer: Customer) => `
Hi ${customer.name},

Thank you for choosing MITC for your ${customer.productDetails.title}!

We'd greatly appreciate if you could share your experience with us. Your feedback helps us serve you better.

Leave a review: [Review Link]

Best regards,
MITC Team
  `.trim(),
};

// Get customers needing warranty reminders (3 days before expiry)
export const getWarrantyReminderCustomers = (customers: Customer[]): Customer[] => {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return customers.filter((customer) => {
    if (customer.status !== 'Active') return false;
    
    const warrantyEnd = customer.warrantyEndDate;
    return warrantyEnd >= now && warrantyEnd <= threeDaysFromNow;
  });
};

// Get customers with expired warranties
export const getExpiredWarrantyCustomers = (customers: Customer[]): Customer[] => {
  const now = new Date();

  return customers.filter((customer) => {
    if (customer.status !== 'Active') return false;
    return customer.warrantyEndDate < now;
  });
};

// Format notification message
export const formatNotificationMessage = (
  template: string,
  productTitle: string
): string => {
  return template.replace('[Product Title]', productTitle);
};