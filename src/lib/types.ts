export interface Show {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageId: string;
  date: string;
  venue: string;
  price: number;
  tourStops?: TourStop[];
}

export interface Performance {
  id: string;
  date: string; // ISO string
  timeLabel: string; // Display time e.g. "4:30 PM"
}

export interface TourStop {
  id: string;
  city: string;
  venue: string;
  address: string;
  dateRange: string;
  performances: Performance[];
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  imageId: string;
  type: 'food' | 'souvenir';
  price: number;
}

export interface Ticket {
  id: string;
  showId: string;
  showTitle: string;
  date: string;
  seat: string;
  qrCodeValue: string;
}

// Order Management Types
export type OrderStatus = 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELLED';

export interface OrderSeat {
  sectionId: string;
  sectionName: string;
  row: string;
  seatNumber: number;
  ticketType: 'adult' | 'child' | 'promo';
  price: number;
}

export interface OrderVenue {
  name: string;
  address: string;
}

export interface OrderPaymentMethod {
  type: string;
  last4: string;
}

export interface Order {
  orderId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;

  // Customer Info
  customerEmail: string;
  customerName: string;

  // Event Info
  showId: string;
  showName: string;
  performanceId?: string;
  performanceDate: Date;
  venue: OrderVenue;

  // Seats
  seats: OrderSeat[];

  // Payment
  subtotal: number;
  fees: number;
  total: number;
  paymentMethod: OrderPaymentMethod;
  stripeCustomerId?: string;
  paymentMethodId?: string;

  // QR Code
  qrCodeData: string;
  qrCodeUrl?: string;
}

export interface CreateOrderPayload {
  items: Array<{
    seatId: string;
    section: string;
    price: number;
    label: string;
    wristband?: {
      type: string;
      spendLimit: string;
    };
  }>;
  total: number;
  paymentToken: string;
  customerName: string;
  customerEmail: string;
  showId?: string;
}
