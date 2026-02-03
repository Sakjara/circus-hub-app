import TicketCard from '@/components/ticket-card';
import { userTickets } from '@/lib/data';

export default function TicketsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
          My Tickets
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Here are your digital tickets. Present the QR code at the entrance for validation. Enjoy the show!
        </p>
      </div>

      {userTickets.length > 0 ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {userTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Tickets Found</h2>
          <p className="text-muted-foreground mt-2">
            You haven't purchased any tickets yet.
          </p>
        </div>
      )}
    </div>
  );
}
