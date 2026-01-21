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
  partsResponsibility?: 'fixer' | 'customer' | 'none';
  partsNotes?: string;
  priceEstimate: { min: number; max: number };
  finalPrice?: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  negotiation?: {
    // Formalities
    partsResponsibility?: 'fixer' | 'customer' | 'shared';
    partsNotes?: string;
    formalitiesProposedBy?: string; // userId who last proposed
    formalitiesConfirmedBy?: string[]; // userIds who confirmed

    // Price
    proposedPrice?: number;
    priceProposedBy?: string; // userId who last proposed
    priceConfirmedBy?: string[]; // userIds who confirmed

    // Meetup
    proposedLocation?: SafeZone;
    proposedDate?: string;
    meetupProposedBy?: string; // userId who last proposed
    meetupConfirmedBy?: string[]; // userIds who confirmed

    // Overall status
    allConfirmed?: boolean;
  };
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'negotiating'
  | 'ready'
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

export interface Notification {
  id: string;
  userId: string;
  type: 'order_accepted' | 'order_status_changed' | 'new_message' | 'order_completed' | 'order_cancelled' | 'fixer_arrived' | 'fixer_en_route';
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  timestamp: string;
}
