import type { Show, Vendor, Ticket } from '@/lib/types';

export const shows: Show[] = [
  {
    id: '1',
    title: 'Cirque du Mystique',
    description: 'A journey into a world of magic and wonder.',
    longDescription: 'Cirque du Mystique blends breathtaking acrobatics with enchanting illusions, creating a spectacle that will leave you spellbound. Follow the story of a young hero as they traverse a mystical realm filled with curious creatures and powerful sorcerers. Perfect for all ages.',
    imageId: 'show1',
    date: '2024-10-26T20:00:00Z',
    venue: 'Grand Arena, Las Vegas',
    price: 75.0,
  },
  {
    id: '2',
    title: 'Acrobatic Marvels',
    description: 'Heart-stopping stunts and incredible feats of strength.',
    longDescription: 'Prepare to be on the edge of your seat with Acrobatic Marvels. This high-energy show features world-class gymnasts, aerialists, and contortionists performing seemingly impossible feats. It\'s a thrilling showcase of human potential and physical artistry.',
    imageId: 'show2',
    date: '2024-11-15T19:30:00Z',
    venue: 'The Big Top, Orlando',
    price: 60.0,
  },
  {
    id: '3',
    title: 'Clown Town Follies',
    description: 'Laugh-out-loud comedy for the whole family.',
    longDescription: 'Get ready for a barrel of laughs with the Clown Town Follies! Our hilarious troupe of clowns will charm you with their classic gags, silly antics, and surprising talents. It\'s a joyful, lighthearted show that proves laughter is the best medicine.',
    imageId: 'show3',
    date: '2024-12-01T14:00:00Z',
    venue: 'Comedy Tent, Chicago',
    price: 45.0,
  },
  {
    id: '4',
    title: 'The Alchemist\'s Dream',
    description: 'A spectacular fusion of circus and storytelling.',
    longDescription: 'Enter the laboratory of a whimsical alchemist in this narrative-driven circus show. Combining dance, puppetry, and high-flying acts, The Alchemist\'s Dream tells a captivating story of creation, ambition, and the magic of discovery.',
    imageId: 'show4',
    date: '2025-01-20T20:00:00Z',
    venue: 'Royal Theater, New York',
    price: 90.0,
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
    showTitle: 'Cirque du Mystique',
    date: '2024-10-26T20:00:00Z',
    seat: 'Section A, Row 5, Seat 12',
    qrCodeValue: 'GARDEN-BROS-TICKET-tkt123-SHOW1',
  },
  {
    id: 'tkt456',
    showId: '2',
    showTitle: 'Acrobatic Marvels',
    date: '2024-11-15T19:30:00Z',
    seat: 'Section C, Row 2, Seat 4',
    qrCodeValue: 'GARDEN-BROS-TICKET-tkt456-SHOW2',
  },
];
