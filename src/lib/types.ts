export interface Show {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageId: string;
  date: string;
  venue: string;
  price: number;
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
