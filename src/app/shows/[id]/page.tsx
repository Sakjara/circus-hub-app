import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Clock, Star } from 'lucide-react';

import { shows } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const seats = Array.from({ length: 8 * 12 }, (_, i) => {
  const status = Math.random() > 0.6 ? 'sold' : 'available';
  return { id: i, status };
});

export default function ShowDetailPage({ params }: { params: { id: string } }) {
  const show = shows.find((s) => s.id === params.id);

  if (!show) {
    notFound();
  }

  const showImage = PlaceHolderImages.find((img) => img.id === show.imageId);
  const showDate = new Date(show.date);

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
              <h3 className="font-headline text-xl mb-4">Select Your Seats</h3>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="w-full h-2 bg-muted rounded-full mb-4" />
                <p className="text-center text-sm text-muted-foreground mb-4">STAGE</p>
                <div className="grid grid-cols-12 gap-1.5">
                  {seats.map(seat => (
                    <Button
                      key={seat.id}
                      variant={seat.status === 'sold' ? 'secondary' : 'outline'}
                      size="icon"
                      className="h-6 w-6 text-xs"
                      disabled={seat.status === 'sold'}
                      aria-label={`Seat ${seat.id}`}
                    >
                      {/* Seat number could go here */}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full border mr-1.5"></div>Available</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>Selected</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-secondary mr-1.5"></div>Sold</div>
                </div>
              </div>
              <Button size="lg" className="w-full mt-6">
                <Ticket className="mr-2 h-5 w-5" />
                Buy Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
