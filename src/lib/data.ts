import type { Show, Vendor, Ticket } from '@/lib/types';

export const shows: Show[] = [
  {
    id: '1',
    title: 'Fun Factory',
    description: 'A whimsical world of fun, laughs, and pure entertainment.',
    longDescription: 'Step into the Fun Factory, where laughter is manufactured and joy is the main product! This show is a delightful explosion of colors, comedy, and crazy contraptions. Perfect for kids and kids at heart, it\'s an unforgettable experience that will have the whole family smiling.',
    imageId: 'show1',
    date: '2024-11-10T18:00:00Z',
    venue: 'The Fun Dome, Miami',
    price: 55.0,
  },
  {
    id: '2',
    title: 'Nuclear Circus',
    description: 'A high-octane thrill ride with mind-blowing stunts.',
    longDescription: 'Brace yourself for the Nuclear Circus, a post-apocalyptic fusion of daredevilry and dazzling spectacle. Witness breathtaking motorcycle stunts inside the Globe of Death, death-defying aerial acts, and explosive performances that will leave you speechless. This is circus entertainment at its most extreme.',
    imageId: 'show2',
    date: '2024-11-25T20:00:00Z',
    venue: 'Thunderdome, Los Angeles',
    price: 85.0,
  },
];

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Popcorn Palace',
    description: 'Classic circus popcorn, candy, and snacks.',
    imageId: 'vendor1',
    type: 'food',
    price: 8.50,
  },
  {
    id: '2',
    name: 'The Big Sip',
    description: 'Refreshing lemonades, sodas, and drinks.',
    imageId: 'vendor2',
    type: 'food',
    price: 5.00,
  },
  {
    id: '4',
    name: 'Gourmet Grille',
    description: 'Hot dogs, pretzels, and other tasty bites.',
    imageId: 'vendor4',
    type: 'food',
    price: 12.00,
  },
  {
    id: '3',
    name: 'Circus Souvenirs',
    description: 'Light-up toys, apparel, and memories to take home.',
    imageId: 'vendor3',
    type: 'souvenir',
    price: 25.00,
  },
  {
    id: '5',
    name: 'Official Tour Cap',
    description: 'A stylish cap with the circus logo.',
    imageId: 'souvenir-cap',
    type: 'souvenir',
    price: 20.00,
  },
];

export const userTickets: Ticket[] = [
  {
    id: 'tkt123',
    showId: '1',
    showTitle: 'Fun Factory',
    date: '2024-11-10T18:00:00Z',
    seat: 'VIP Right, Row 2, Seat 5',
    qrCodeValue: 'GARDEN-BROS-TICKET-tkt123-SHOW1',
  },
  {
    id: 'tkt456',
    showId: '2',
    showTitle: 'Nuclear Circus',
    date: '2024-11-25T20:00:00Z',
    seat: 'Premium Top, Row 1, Seat 10',
    qrCodeValue: 'GARDEN-BROS-TICKET-tkt456-SHOW2',
  },
];
