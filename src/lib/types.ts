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
