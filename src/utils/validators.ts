export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 10000000; // Max 1 crore
};

export const validateStock = (stock: number): boolean => {
  return stock >= 0 && stock <= 100;
};

export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateImageFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  const maxSize = 700 * 1024; // 700KB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Image size must be less than 700KB (current: ${Math.round(file.size / 1024)}KB)`,
    };
  }
  
  return { isValid: true };
};