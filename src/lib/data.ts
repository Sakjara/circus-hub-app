import type { Show, Vendor, Ticket } from '@/lib/types';

export const shows: Show[] = [
  {
    id: '1',
    title: 'Fun Factory',
    description: 'Humans Gone Wild! A whimsical world of 60+ performers and 5 rings of fun.',
    longDescription: 'Garden Bros Nuclear Circus delivers non-stop action with 60+ world-class performers, a 5-ring layout for unbeatable views, concert-style lights and sound, and a smooth, fast-moving show built for all ages. It\'s a modern, climate-controlled Big Top experience with real talent and zero filler.',
    imageId: 'show1',
    date: '2024-11-10T18:00:00Z',
    venue: 'The Fun Dome, Miami',
    price: 55.0,
  },
  {
    id: '2',
    title: 'Nuclear Circus',
    description: 'A high-octane thrill ride with mind-blowing stunts and 5-ring spectacle.',
    longDescription: 'Garden Bros Nuclear Circus delivers non-stop action with 60+ world-class performers, a 5-ring layout for unbeatable views, concert-style lights and sound, and a smooth, fast-moving show built for all ages. It\'s a modern, climate-controlled Big Top experience with real talent and zero filler.',
    imageId: 'show2',
    date: '2025-02-12T16:30:00Z', // Default/First show
    venue: 'North Point Mall, Alpharetta',
    price: 85.0,
    tourStops: [
      {
        id: 'stop-alpharetta',
        city: 'Alpharetta, GA',
        venue: 'North Point Mall',
        address: '1000 North Point Circle',
        dateRange: 'Feb 12 - 16',
        performances: [
          { id: 'perf-1', date: '2025-02-12T16:30:00', timeLabel: 'Thursday, Feb 12 - 4:30 PM' },
          { id: 'perf-2', date: '2025-02-12T19:30:00', timeLabel: 'Thursday, Feb 12 - 7:30 PM' },
          { id: 'perf-3', date: '2025-02-13T16:30:00', timeLabel: 'Friday, Feb 13 - 4:30 PM' },
          { id: 'perf-4', date: '2025-02-13T19:30:00', timeLabel: 'Friday, Feb 13 - 7:30 PM' },
          { id: 'perf-5', date: '2025-02-14T13:30:00', timeLabel: 'Saturday, Feb 14 - 1:30 PM' },
          { id: 'perf-6', date: '2025-02-14T16:30:00', timeLabel: 'Saturday, Feb 14 - 4:30 PM' },
          { id: 'perf-7', date: '2025-02-14T19:30:00', timeLabel: 'Saturday, Feb 14 - 7:30 PM' },
          { id: 'perf-8', date: '2025-02-15T13:00:00', timeLabel: 'Sunday, Feb 15 - 1:00 PM' },
          { id: 'perf-9', date: '2025-02-15T16:00:00', timeLabel: 'Sunday, Feb 15 - 4:00 PM' },
          { id: 'perf-10', date: '2025-02-15T19:00:00', timeLabel: 'Sunday, Feb 15 - 7:00 PM' },
          { id: 'perf-11', date: '2025-02-16T13:00:00', timeLabel: 'Monday, Feb 16 - 1:00 PM' },
          { id: 'perf-12', date: '2025-02-16T16:00:00', timeLabel: 'Monday, Feb 16 - 4:00 PM' },
        ]
      },
      {
        id: 'stop-charlotte',
        city: 'Charlotte, NC',
        venue: 'Truliant Amphitheater',
        address: '707 Pavilion Blvd',
        dateRange: 'Feb 12 - 16',
        performances: [] // Placeholder
      },
      {
        id: 'stop-richmond',
        city: 'Richmond, VA',
        venue: 'The Diamond',
        address: '3001 N Arthur Ashe Blvd',
        dateRange: 'Mar 5 - 9',
        performances: []
      },
      {
        id: 'stop-oxon',
        city: 'Oxon Hill, MD',
        venue: 'National Harbor',
        address: '165 Waterfront Street',
        dateRange: 'Mar 5 - 8',
        performances: []
      },
      {
        id: 'stop-philly',
        city: 'Philadelphia, PA',
        venue: 'Franklin Mall',
        address: '1455 Franklin Mills Circle',
        dateRange: 'Mar 12 - 22',
        performances: []
      },
      {
        id: 'stop-rockaway',
        city: 'Rockaway, NJ',
        venue: 'Rockaway Townsquare',
        address: '301 Mt Hope Ave',
        dateRange: 'Mar 26 - 29',
        performances: []
      },
      {
        id: 'stop-rochester',
        city: 'Rochester, NY',
        venue: 'The Mall at Greece Ridge',
        address: '271 Greece Ridge Center Drive',
        dateRange: 'Apr 2 - 5',
        performances: []
      }
    ]
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
