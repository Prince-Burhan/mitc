export interface CloudinarySettings {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
  enabled: boolean;
  lastTested?: Date;
  testStatus?: 'success' | 'failed';
}

export interface IntegrationSettings {
  cloudinary?: CloudinarySettings;
  // Future integrations can be added here
  stripe?: any;
  paypal?: any;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  resource_type: string;
}
