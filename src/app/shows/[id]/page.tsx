'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { useState } from 'react';

import { shows } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SeatingChart, type SectionName } from '@/components/seating-chart';
import { use } from 'react';
import { BookingSummary, type SelectedSeat } from '@/components/booking/BookingSummary';

// ...

export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);
  const [checkoutSeats, setCheckoutSeats] = useState<SelectedSeat[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const show = shows.find((s) => s.id === id);

  if (!show) {
    notFound();
  }

  const showImage = PlaceHolderImages.find((img) => img.id === show.imageId);
  const showDate = new Date(show.date);

  const handleCheckout = (seats: any[]) => {
    const mapped: SelectedSeat[] = seats.map(s => ({
      id: s.id,
      label: s.label,
      price: s.price,
      section: s.section
    }));
    setCheckoutSeats(mapped);
    setIsCheckingOut(true);
  };

  const handleBookingComplete = (orderData: any) => {
    console.log('Order Completed:', orderData);
    // Here we would redirect to a success page or show a modal
    alert('Order Placed Successfully! (See console for payload)');
    setIsCheckingOut(false);
    setSelectedSection(null);
  };

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BookingSummary
          selectedSeats={checkoutSeats}
          onBack={() => setIsCheckingOut(false)}
          onComplete={handleBookingComplete}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
            {showImage && (
              <Image
                src={showImage.imageUrl}
                alt={show.title}
                fill
                className="object-cover"
                data-ai-hint={showImage.imageHint}
              />
            )}
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{show.title}</h1>
          <p className="text-muted-foreground text-lg">{show.longDescription}</p>
        </div>
        <div className="lg:col-span-2">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex justify-between items-center">
                <span>Event Details</span>
                <Badge variant="secondary" className="text-lg">${show.price.toFixed(2)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <span>{format(showDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <span>{format(showDate, 'h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-primary" />
                  <span>{show.venue}</span>
                </div>
              </div>
              <Separator className="my-6" />
              <h3 className="font-headline text-xl mb-4">Select Your Section</h3>
              <SeatingChart
                onSectionSelect={(s) => setSelectedSection(s as SectionName | null)}
                selectedSection={selectedSection}
                onCheckout={handleCheckout}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
