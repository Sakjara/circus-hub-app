import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin, Sparkles, Ticket as TicketIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Ticket } from '@/lib/types';
import { shows } from '@/lib/data';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const show = shows.find((s) => s.id === ticket.showId);
  if (!show) return null;

  const ticketDate = new Date(ticket.date);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrCodeValue)}`;

  return (
    <Card className="shadow-lg overflow-hidden flex flex-col md:flex-row transition-transform hover:scale-[1.02] duration-300">
      <div className="p-6 bg-primary/10 flex flex-col items-center justify-center md:w-1/3">
        <Image
          src={qrCodeUrl}
          alt="Ticket QR Code"
          width={150}
          height={150}
          className="rounded-lg shadow-md"
        />
        <p className="mt-2 text-xs text-muted-foreground tracking-widest">{ticket.id}</p>
      </div>
      <div className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">Garden Bros Circus</p>
              <CardTitle className="font-headline text-3xl mt-1">{ticket.showTitle}</CardTitle>
            </div>
            <TicketIcon className="h-10 w-10 text-accent opacity-50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 mt-1 shrink-0" />
              <div>
                <strong>Date & Time</strong>
                <p>{format(ticketDate, 'EEEE, MMM d, yyyy')} at {format(ticketDate, 'h:mm a')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1 shrink-0" />
              <div>
                <strong>Venue</strong>
                <p>{show.venue}</p>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-start">
            <Sparkles className="h-4 w-4 mr-2 mt-1 shrink-0" />
            <div>
              <strong>Seat</strong>
              <p className="font-bold text-foreground">{ticket.seat}</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
