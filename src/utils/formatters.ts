import { format, formatDistanceToNow, addDays } from 'date-fns';

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatDate = (date: Date, formatStr: string = 'PP'): string => {
  return format(date, formatStr);
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'PPp');
};

export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const calculateWarrantyEndDate = (purchaseDate: Date): Date => {
  return addDays(purchaseDate, 15);
};

export const isWarrantyActive = (warrantyEndDate: Date): boolean => {
  return new Date() < warrantyEndDate;
};

export const formatPhone = (phone: string): string => {
  // Format: +91-XXXXX-XXXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};