import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SiteSettings } from '../types';

const SETTINGS_DOC_ID = 'site';
const COLLECTION_NAME = 'settings';

// Helper to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
};

// Get site settings
export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as SiteSettings;
    }

    // Return default settings if none exist
    return getDefaultSettings();
  } catch (error: any) {
    console.error('Error getting settings:', error);
    throw new Error(error.message || 'Failed to get settings');
  }
};

// Update site settings
export const updateSettings = async (
  updates: Partial<SiteSettings>
): Promise<SiteSettings> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const current = await getSettings();

    const updatedSettings = {
      ...current,
      ...updates,
      updatedAt: new Date(),
    };

    // Convert dates to Timestamps for Firestore
    const firestoreData = {
      ...updatedSettings,
      createdAt: Timestamp.fromDate(updatedSettings.createdAt),
      updatedAt: Timestamp.now(),
    };

    await setDoc(docRef, firestoreData, { merge: true });
    return updatedSettings;
  } catch (error: any) {
    console.error('Error updating settings:', error);
    throw new Error(error.message || 'Failed to update settings');
  }
};

// Initialize default settings
export const initializeSettings = async (): Promise<SiteSettings> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const defaultSettings = getDefaultSettings();
      const firestoreData = {
        ...defaultSettings,
        createdAt: Timestamp.fromDate(defaultSettings.createdAt),
        updatedAt: Timestamp.fromDate(defaultSettings.updatedAt),
      };
      await setDoc(docRef, firestoreData);
      return defaultSettings;
    }

    const data = docSnap.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as SiteSettings;
  } catch (error: any) {
    console.error('Error initializing settings:', error);
    throw new Error(error.message || 'Failed to initialize settings');
  }
};

// Get default settings
function getDefaultSettings(): SiteSettings {
  const now = new Date();
  return {
    branding: {
      logo: '',
      favicon: '',
      companyName: 'Mateen IT Corp',
      slogan: 'Premium Laptops in Kashmir',
      primaryColor: '#21808D',
      secondaryColor: '#5E5240',
    },
    contact: {
      phone: '+91-XXXXXXXXXX',
      email: 'contact@mitc.com',
      address: 'Maisuma, Near Gaw Kadal Bridge, Srinagar, Kashmir 190019',
      whatsapp: '+91-XXXXXXXXXX',
      instagram: '@mitc_kashmir',
      facebook: 'mitc.kashmir',
    },
    business: {
      openingHours: '10:00 AM - 8:00 PM',
      workingDays: 'Monday - Saturday',
      warrantyPeriod: 15, // days
      maxProducts: 80,
      showPrices: true,
      allowReviews: true,
    },
    pages: {
      about: {
        title: 'About MITC',
        content:
          'Your trusted partner for premium laptops in Srinagar, Kashmir. Delivering quality, reliability, and exceptional service.',
        image: '',
      },
      terms: {
        title: 'Terms & Conditions',
        content: 'Terms and conditions content...',
      },
      privacy: {
        title: 'Privacy Policy',
        content: 'Privacy policy content...',
      },
      contact: {
        title: 'Contact Us',
        content: 'Get in touch with us for all your laptop needs. Visit our showroom or reach out through phone, email, or social media.',
      },
    },
    seo: {
      metaTitle: 'MITC - Premium Laptops in Kashmir',
      metaDescription:
        'Buy premium quality laptops in Srinagar, Kashmir. HP, Dell, Lenovo, Apple and more. 15-day testing warranty. Visit our showroom in Maisuma.',
      metaKeywords:
        'laptops Kashmir, laptops Srinagar, HP laptops, Dell laptops, Apple MacBook, laptop store Kashmir',
      ogImage: '',
    },
    integrations: {
      googleAnalytics: '',
      facebookPixel: '',
      googleMapsEmbed: '',
    },
    notifications: {
      warrantyReminders: true,
      reviewRequests: true,
      emailNotifications: true,
      smsNotifications: false,
    },
    whatsappTemplates: [],
    homepageLimits: {
      topHighlights: 10,
      deals: 10,
      newArrivals: 10,
      limitedStock: 10,
      categoryGrid: 30,
      bottomHighlights: 10,
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently under maintenance. Please check back soon.',
      allowedIPs: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

// Update specific setting section
export const updateBranding = async (
  branding: SiteSettings['branding']
): Promise<SiteSettings> => {
  return updateSettings({ branding });
};

export const updateContact = async (contact: SiteSettings['contact']): Promise<SiteSettings> => {
  return updateSettings({ contact });
};

export const updateBusiness = async (
  business: SiteSettings['business']
): Promise<SiteSettings> => {
  return updateSettings({ business });
};

export const updatePages = async (pages: SiteSettings['pages']): Promise<SiteSettings> => {
  return updateSettings({ pages });
};

export const updateSEO = async (seo: SiteSettings['seo']): Promise<SiteSettings> => {
  return updateSettings({ seo });
};

export const updateIntegrations = async (
  integrations: SiteSettings['integrations']
): Promise<SiteSettings> => {
  return updateSettings({ integrations });
};

export const updateNotifications = async (
  notifications: SiteSettings['notifications']
): Promise<SiteSettings> => {
  return updateSettings({ notifications });
};

export const toggleMaintenanceMode = async (enabled: boolean): Promise<SiteSettings> => {
  const current = await getSettings();
  return updateSettings({
    maintenance: {
      ...current.maintenance,
      maintenanceMode: enabled,
    },
  });
};