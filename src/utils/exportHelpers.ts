import { StoreReview, Customer } from '../types';
import { formatDate, formatPrice } from './formatters';

// CSV Export
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const cell = row[header];
          // Escape commas and quotes
          if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

// Reviews Export
export const exportReviewsToCSV = (reviews: StoreReview[]) => {
  const data = reviews.map((review) => ({
    'Customer Name': review.customerName,
    Rating: review.rating,
    Title: review.title || '',
    Comment: review.comment,
    Status: review.status,
    Source: review.source,
    Date: formatDate(review.createdAt),
  }));

  exportToCSV(data, `store-reviews-${Date.now()}`);
};

// Customers Export
export const exportCustomersToCSV = (customers: Customer[]) => {
  const data = customers.map((customer) => ({
    Name: customer.name,
    Phone: customer.phone,
    Email: customer.email,
    Product: customer.productDetails.title,
    'Purchase Date': formatDate(customer.purchaseDate),
    'Warranty End': formatDate(customer.warrantyEndDate),
    Status: customer.status,
    Notes: customer.notes || '',
  }));

  exportToCSV(data, `customers-${Date.now()}`);
};

// PDF Export (Basic - uses browser print)
export const exportToPDF = (elementId: string, filename: string) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  const element = document.getElementById(elementId);

  if (!element || !printWindow) {
    alert('Unable to generate PDF');
    return;
  }

  printWindow.document.write('<html><head><title>' + filename + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write(`
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f3f4f6; font-weight: bold; }
    h1 { color: #1f2937; }
  `);
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

// Helper function to download file
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};