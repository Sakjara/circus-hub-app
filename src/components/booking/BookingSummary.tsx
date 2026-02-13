'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FizzyActionButton } from '@/components/ui/fizzy-action-button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Lock, CheckCircle2, Download, Mail } from 'lucide-react';
import { SeatService } from '@/services/seat-service';
import { QRCodeService } from '@/services/qrcode-service';
import { generateTicketPDF, type TicketData } from '@/lib/ticket-generator';

// Types
export interface SelectedSeat {
    id: string;
    label: string;
    price: number;
    section: string;
}

export type WristbandType = 'Adult' | 'Kid';
export type SpendLimit = 'None' | '20' | '50' | 'Unlimited';

interface WristbandConfig {
    seatId: string;
    type: WristbandType;
    spendLimit: SpendLimit;
}

interface BookingSummaryProps {
    selectedSeats: SelectedSeat[];
    onBack: () => void;
    onComplete: (orderData: any) => void;
    showId?: string;
}

export function BookingSummary({ selectedSeats, onBack, onComplete, showId }: BookingSummaryProps) {
    const [configs, setConfigs] = useState<Record<string, WristbandConfig>>(() => {
        const initial: Record<string, WristbandConfig> = {};
        selectedSeats.forEach(seat => {
            initial[seat.id] = { seatId: seat.id, type: 'Adult', spendLimit: 'Unlimited' };
        });
        return initial;
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [cardName, setCardName] = useState('');
    const [email, setEmail] = useState('');
    const [successData, setSuccessData] = useState<{
        qr: string;
        orderId: string;
        orderData: any;
        qrCodeData: string;
    } | null>(null);

    const updateConfig = (seatId: string, updates: Partial<WristbandConfig>) => {
        setConfigs(prev => ({
            ...prev,
            [seatId]: { ...prev[seatId], ...updates }
        }));
    };

    const calculateTotal = () => {
        let total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
        // Apply Family Discount (20% for 4+)
        if (selectedSeats.length >= 4) {
            total = total * 0.8;
        }
        return total;
    };

    const handlePay = async () => {
        setIsProcessing(true);

        // Simulate Stripe Tokenization
        await new Promise(resolve => setTimeout(resolve, 2000));

        const mockToken = `tok_visa_${Math.random().toString(36).substring(7)}`;

        // Construct Order Data
        const orderPayload = {
            items: selectedSeats.map(seat => ({
                seatId: seat.id,
                section: seat.section,
                price: seat.price,
                label: seat.label,
                wristband: {
                    type: configs[seat.id].type,
                    spendLimit: configs[seat.id].spendLimit
                }
            })),
            total: calculateTotal(),
            paymentToken: mockToken,
            customerName: cardName,
            customerEmail: email,
            showId // Pass showId to payload
        };

        // Race between order creation and a 15s timeout
        const timeoutPromise = new Promise<{ success: boolean; error?: any; orderId?: string }>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out. Please check your internet connection.')), 15000)
        );

        try {
            console.log('Starting order creation...');
            const result = await Promise.race([
                SeatService.createOrder(orderPayload),
                timeoutPromise
            ]);

            console.log('Order creation result:', result);
            setIsProcessing(false);

            if (result.success && result.orderId) {
                // ... success handling
                try {
                    const qr = await QRCodeService.generateQRCode(result.orderId);
                    setSuccessData({
                        qr,
                        orderId: result.orderId,
                        orderData: orderPayload,
                        qrCodeData: result.orderId
                    });
                } catch (e) {
                    console.error(e);
                    alert('Order saved, but failed to generate QR');
                    onComplete({ ...orderPayload, orderId: result.orderId });
                }
            } else {
                console.error('Order creation failed:', result.error);
                alert(`Failed to create order: ${result.error?.message || 'Unknown error'}`);
            }
        } catch (error: any) {
            console.error('Payment processing error:', error);
            setIsProcessing(false);
            alert(error.message || 'An unexpected error occurred during payment.');
        }
    };

    const handleDownloadTicket = async () => {
        if (!successData) return;

        try {
            // Parse seat information from orderData
            const seats = successData.orderData.items.map((item: any) => {
                // Extract section, row, and seat number from label (e.g., "101-A-5")
                const parts = item.label.split('-');
                return {
                    section: item.section || parts[0] || 'General',
                    row: parts[1] || 'A',
                    seatNumber: parseInt(parts[2]) || 1,
                    ticketType: item.wristband?.type?.toLowerCase() || 'adult',
                    price: item.price
                };
            });

            // Calculate fees (assuming 5% service fee)
            const subtotal = successData.orderData.total;
            const fees = subtotal * 0.05;
            const total = subtotal + fees;

            // Create ticket data
            const ticketData: TicketData = {
                orderId: successData.orderId,
                orderDate: new Date(),
                customerEmail: successData.orderData.customerEmail || email,
                customerName: successData.orderData.customerName || cardName,
                showName: 'Garden Bros Nuclear Circus',
                venueName: 'North Point Mall',
                venueAddress: '1000 North Point Circle, Alpharetta, GA',
                eventDate: new Date('2025-02-12'),
                eventTime: '7:30 PM',
                seats,
                subtotal,
                fees,
                total,
                paymentMethod: {
                    type: 'Visa',
                    last4: '1234'
                },
                qrCodeData: successData.qrCodeData
            };

            // Generate PDF
            await generateTicketPDF(ticketData);
        } catch (error) {
            console.error('Error generating ticket PDF:', error);
            alert('Failed to generate ticket PDF. Please try again.');
        }
    };

    if (successData) {
        return (
            <div className="max-w-md mx-auto p-8 text-center space-y-6 bg-white rounded-xl shadow-2xl mt-12">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in spin-in-12 duration-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Order Confirmed!</h1>
                <p className="text-slate-600">Your order has been successfully saved. Here is your pickup code:</p>

                <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-dashed border-slate-300">
                    <img src={successData.qr} alt="Order QR Code" className="w-64 h-64" />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Order ID</p>
                    <p className="text-2xl font-mono font-bold tracking-wider">{successData.orderId}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-blue-900">Tickets sent by email</p>
                        <p className="text-sm text-blue-700">We've sent your tickets to your email. Check your inbox for your QR code.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button className="w-full" size="lg" onClick={() => onComplete({ orderId: successData.orderId })}>
                        Finish & Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const total = subtotal; // Tickets are priced correctly from previous screen

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 text-slate-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-500 hover:text-white transition-all shadow-none hover:shadow-md"
            >
                ← Back to Seat Selection
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Wristband Configuration */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configure Wristbands</CardTitle>
                            <CardDescription>Assign specific permissions for each family member.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedSeats.map((seat) => (
                                <div key={seat.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg items-start sm:items-center bg-slate-50">
                                    <div className="flex-1">
                                        <div className="font-bold">{seat.label}</div>
                                        <div className="text-sm text-muted-foreground">{seat.section} • ${seat.price.toFixed(2)}</div>
                                    </div>

                                    <div className="flex gap-2 w-full sm:w-auto">
                                        {/* Size / Type */}
                                        <Select
                                            value={configs[seat.id]?.type}
                                            onValueChange={(v) => updateConfig(seat.id, { type: v as WristbandType, spendLimit: v === 'Adult' ? 'Unlimited' : 'None' })}
                                        >
                                            <SelectTrigger className="w-[110px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Adult">Adult</SelectItem>
                                                <SelectItem value="Kid">Kid</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* Spend Limit */}
                                        <Select
                                            value={configs[seat.id]?.spendLimit}
                                            onValueChange={(v) => updateConfig(seat.id, { spendLimit: v as SpendLimit })}
                                            disabled={configs[seat.id]?.type === 'Adult'}
                                        >
                                            <SelectTrigger className="w-[130px]">
                                                <SelectValue placeholder="Limit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="None">No Spend</SelectItem>
                                                <SelectItem value="20">$20 Limit</SelectItem>
                                                <SelectItem value="50">$50 Limit</SelectItem>
                                                {configs[seat.id]?.type === 'Adult' && <SelectItem value="Unlimited">Unlimited</SelectItem>}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Payment Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</CardTitle>
                            <CardDescription>Secure 1-Click Payment via Stripe</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border border-blue-100 bg-blue-50 text-blue-800 rounded-md text-sm flex gap-2">
                                <Lock className="w-4 h-4 mt-0.5" />
                                <div>
                                    <strong>Tokenized Security:</strong> We do not store your card details.
                                    A secure token is created to allow wristband payments during the event.
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email Receipt</Label>
                                    <Input placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cardholder Name</Label>
                                    <Input placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Card Number</Label>
                                {/* Mock Stripe Element */}
                                <div className="border rounded-md p-3 bg-white shadow-sm flex items-center justify-between text-slate-500">
                                    <span>•••• •••• •••• 4242</span>
                                    <Badge variant="outline" className="text-xs">VISA</Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expiry</Label>
                                    <Input placeholder="MM/YY" defaultValue="12/28" />
                                </div>
                                <div className="space-y-2">
                                    <Label>CVC</Label>
                                    <Input placeholder="123" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="md:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-muted-foreground">Tickets ({selectedSeats.length})</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <FizzyActionButton
                                onClick={handlePay}
                                disabled={isProcessing || !cardName || !email}
                                isLoading={isProcessing}
                                className="w-full h-14 text-white font-bold shadow-xl transition-all rounded-lg overflow-hidden group relative !border-0"
                                style={{
                                    background: 'linear-gradient(144deg, rgba(0, 67, 176, 1) 23%, rgba(27, 222, 150, 1) 100%)',
                                    border: 'none',
                                    color: 'white'
                                }}
                            >
                                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                            </FizzyActionButton>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
