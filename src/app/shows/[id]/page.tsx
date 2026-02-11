'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import { useState } from 'react';

import { shows } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SeatingChart, type SectionName } from '@/components/seating-chart';
import { use } from 'react';
import { BookingSummary, type SelectedSeat } from '@/components/booking/BookingSummary';
import { TicketSelection } from '@/components/booking/TicketSelection';
import { SeatService } from '@/services/seat-service';

// ... imports

export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);
  const [checkoutSeats, setCheckoutSeats] = useState<SelectedSeat[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSelectingTickets, setIsSelectingTickets] = useState(false); // Added State

  // Schedule State
  const [selectedStopId, setSelectedStopId] = useState<string>('');
  const [selectedPerfId, setSelectedPerfId] = useState<string>('');

  const show = shows.find((s) => s.id === id);

  if (!show) {
    notFound();
  }

  const showImage = PlaceHolderImages.find((img) => img.id === show.imageId);

  // Derived Data for Display
  const hasTourStops = show.tourStops && show.tourStops.length > 0;

  const selectedStop = hasTourStops ? show.tourStops?.find(s => s.id === selectedStopId) : undefined;
  const selectedPerf = selectedStop ? selectedStop.performances.find(p => p.id === selectedPerfId) : undefined;

  // Default to static data if no dynamic selection is active (or if not a tour show)
  let displayDate = new Date(show.date);
  let displayVenue = show.venue;
  let displayTime = format(displayDate, 'h:mm a'); // Default time

  if (hasTourStops) {
    if (selectedPerf) {
      displayDate = new Date(selectedPerf.date);
      displayTime = selectedPerf.timeLabel.split('-')[1]?.trim() || format(displayDate, 'h:mm a');
    }
    if (selectedStop) {
      displayVenue = `${selectedStop.venue}, ${selectedStop.city}`;
    }
  }

  // Effect to reset performance if stop changes
  // (In React state updates are batched, but explicit handler is better)
  const handleStopChange = (val: string) => {
    setSelectedStopId(val);
    setSelectedPerfId(''); // Reset time selection
  };

  // Unique Context ID for Seating/Booking
  const contextId = hasTourStops && selectedStopId && selectedPerfId
    ? `${show.id}-${selectedStopId}-${selectedPerfId}`
    : show.id;

  const handleCheckout = async (seats: SelectedSeat[]) => {
    // Hold seats for 5 minutes
    const seatIds = seats.map(s => s.id);
    const held = await SeatService.holdSeats(seatIds, contextId);

    if (held) {
      setCheckoutSeats(seats);
      setIsSelectingTickets(true);
      // Remove: setIsCheckingOut(true); -> Moved to next step
    } else {
      alert('Failed to hold seats. They may have been taken.');
    }
  };

  const handleTicketSelectionConfirm = (seatsWithTypes: SelectedSeat[]) => {
    setCheckoutSeats(seatsWithTypes); // Update with types and final prices
    setIsSelectingTickets(false);
    setIsCheckingOut(true); // Now go to summary/payment
  };

  const handleBackToMap = () => {
    setIsSelectingTickets(false);
    // Keep seats selected? Yes.
  };

  const handleBookingComplete = (orderData: any) => {
    console.log('Order Completed:', orderData);
    // Here we would redirect to a success page or show a modal
    alert('Order Created! Check console for details.'); // Modified alert message
    setIsCheckingOut(false);
    setCheckoutSeats([]); // Cleared seats after booking
    setSelectedSection(null);
  };

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-8"> {/* Changed py-12 to py-8 */}
        <BookingSummary
          selectedSeats={checkoutSeats}
          onBack={() => setIsCheckingOut(false)}
          onComplete={handleBookingComplete}
          showId={contextId}
        />
      </div>
    );
  }

  if (isSelectingTickets) {
    return (
      <div className="container mx-auto px-4 py-8"> {/* Changed py-12 to py-8 */}
        <TicketSelection
          selectedSeats={checkoutSeats}
          onConfirm={handleTicketSelectionConfirm}
          onBack={handleBackToMap}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid xl:grid-cols-2 gap-8 lg:gap-12">
        {/* ... (Show Info Left Column) ... */}
        <div>
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

        {/* ... (Booking Card Right Column) ... */}
        <div>
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex justify-between items-center">
                <span>Event Details</span>
                <span
                  className="font-body text-lg font-bold text-white px-4 py-2 rounded-full shadow-md bg-emerald-500 flex items-center gap-2"
                >
                  <Ticket className="h-5 w-5" />
                  From $23.27
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Dynamic Schedules */}
              {hasTourStops && (
                <div className="space-y-4 mb-6">
                  {/* Location Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select Location</label>
                    <Select value={selectedStopId} onValueChange={handleStopChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Where do you want to go?" />
                      </SelectTrigger>
                      <SelectContent>
                        {show.tourStops!.map((stop) => (
                          <SelectItem key={stop.id} value={stop.id}>
                            {stop.city}: {stop.venue} ({stop.dateRange})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Selector - Disabled until Location selected */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select Show Time</label>
                    <Select
                      value={selectedPerfId}
                      onValueChange={setSelectedPerfId}
                      disabled={!selectedStopId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={!selectedStopId ? "Select a location first" : "Choose a time"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedStop?.performances.map((perf) => (
                          <SelectItem key={perf.id} value={perf.id}>
                            {perf.timeLabel}
                          </SelectItem>
                        ))}
                        {selectedStop?.performances.length === 0 && (
                          <SelectItem value="none" disabled>No shows available yet</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator className="my-4" />
                </div>
              )}
              {/* Seating Chart with Dynamic Context ID */}
              {(hasTourStops && !selectedPerfId) ? (
                <>
                  <h3 className="font-headline text-xl mb-4">Select Your Section</h3>
                  <div className="h-64 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                    <p className="text-muted-foreground font-medium">Please select a location and time to view seats.</p>
                  </div>
                </>
              ) : (
                <SeatingChart
                  showId={contextId}
                  title="Select Your Section"
                  onSectionSelect={(s) => setSelectedSection(s as SectionName | null)}
                  selectedSection={selectedSection}
                  onCheckout={handleCheckout}
                />
              )}

            </CardContent>
          </Card>
        </div>
      </div >
    </div >
  );
}
