export type AppView = 
  | 'splash'
  | 'welcome'
  | 'signup'
  | 'otp'
  | 'kyc-doc'
  | 'kyc-upload'
  | 'kyc-success'
  | 'home'
  | 'profile'
  | 'edit-profile'
  | 'booking-step1'
  | 'booking-step2'
  | 'booking-step3'
  | 'booking-tracking'
  | 'payment'
  | 'feedback'
  | 'notifications'
  | 'booking-history';

export interface User {
  name: string;
  phone: string;
  email?: string;
  isKycVerified: boolean;
  avatar: string;
  address?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'trip' | 'payment' | 'offer' | 'alert';
}

export interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  type: string;
  weight: number;
  timing: 'now' | 'scheduled';
  date?: string;
  time?: string;
  status: 'pending' | 'active' | 'completed';
  price: number;
}
