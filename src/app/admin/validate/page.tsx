'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userTickets } from '@/lib/data';

type ValidationStatus = 'valid' | 'used' | 'invalid' | 'idle';

export default function ValidatePage() {
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [validatedTicketId, setValidatedTicketId] = useState<string | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;

    const foundTicket = userTickets.find(t => t.qrCodeValue === ticketId || t.id === ticketId);
    
    setValidatedTicketId(ticketId);
    if (!foundTicket) {
      setStatus('invalid');
      return;
    }

    // Mock logic for "used" tickets
    const isUsed = Math.random() > 0.8;
    setStatus(isUsed ? 'used' : 'valid');
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'valid':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: 'Ticket Valid',
          description: 'Access granted. Enjoy the show!',
          color: 'bg-green-500/10 text-green-700 dark:text-green-400',
        };
      case 'used':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
          title: 'Ticket Already Used',
          description: 'This ticket has already been scanned. Access denied.',
          color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        };
      case 'invalid':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Ticket Invalid',
          description: 'This ticket was not found in our system. Access denied.',
          color: 'bg-red-500/10 text-red-700 dark:text-red-400',
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Ticket Validator</CardTitle>
          <CardDescription>Enter the Ticket ID or scan the QR code to validate.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleValidate} className="space-y-4">
            <div className="relative">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g., CIRCUS-HUB-TICKET-tkt123-SHOW1"
                className="pl-10"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!ticketId}>
              Validate Ticket
            </Button>
          </form>
          {status !== 'idle' && statusInfo && (
            <div className={`mt-6 p-4 rounded-lg flex flex-col items-center text-center ${statusInfo.color}`}>
              {statusInfo.icon}
              <h3 className="mt-4 text-xl font-bold">{statusInfo.title}</h3>
              <p className="text-sm">{statusInfo.description}</p>
              <p className="mt-2 text-xs font-mono bg-muted px-2 py-1 rounded">ID: {validatedTicketId}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
