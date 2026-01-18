export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  role: 'customer' | 'fixer' | 'both';
  rating?: number;
  completedJobs?: number;
  skills?: string[];
  createdAt: string;
}

export interface RepairOrder {
  id: string;
  customerId: string;
  fixerId?: string;
  category: 'tech' | 'mobility' | 'dorm';
  subcategory: string;
  deviceBrand?: string;
  deviceModel?: string;
  issueType: string;
  issueDescription: string;
  photoUrl?: string;
  location: SafeZone;
  deliveryMethod: 'meetup' | 'shipping';
  appointmentDate?: string;
  shippingAddress?: string;
  priceEstimate: { min: number; max: number };
  finalPrice?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rating?: number;
  review?: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'escalated';

export interface SafeZone {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  issues: Issue[];
}

export interface Issue {
  id: string;
  label: string;
  priceRange: { min: number; max: number };
  estimatedTime: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}
