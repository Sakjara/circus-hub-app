'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Lock, CheckCircle2, Download } from 'lucide-react';
import { SeatService } from '@/services/seat-service';
import { QRCodeService } from '@/services/qrcode-service';

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
}

export function BookingSummary({ selectedSeats, onBack, onComplete }: BookingSummaryProps) {
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
    const [successData, setSuccessData] = useState<{ qr: string, orderId: string } | null>(null);

    const updateConfig = (seatId: string, updates: Partial<WristbandConfig>) => {
        setConfigs(prev => ({
            ...prev,
            [seatId]: { ...prev[seatId], ...updates }
        }));
    };

    const calculateTotal = () => {
        let total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
        // Add logic for Wristband fees if any? Assuming free included for now.
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
            customerEmail: email
        };

        const result = await SeatService.createOrder(orderPayload);

        setIsProcessing(false);

        if (result.success && result.orderId) {
            try {
                const qr = await QRCodeService.generateQRCode(result.orderId);
                setSuccessData({ qr, orderId: result.orderId });
            } catch (e) {
                console.error(e);
                alert('Order saved, but failed to generate QR');
                onComplete({ ...orderPayload, orderId: result.orderId });
            }
        } else {
            console.error('Order creation failed:', result.error);
            alert('Failed to create order. Please try again.');
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

                <div className="flex flex-col gap-3">
                    <Button className="w-full gap-2" variant="outline" onClick={() => window.print()}>
                        <Download className="w-4 h-4" /> Download Ticket
                    </Button>
                    <Button className="w-full" size="lg" onClick={() => onComplete({ orderId: successData.orderId })}>
                        Finish & Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    const total = calculateTotal();
    const subtotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const discount = subtotal - total;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Button variant="ghost" onClick={onBack} className="mb-4">← Back to Seat Selection</Button>

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
                                        <div className="text-sm text-muted-foreground">{seat.section} • ${seat.price}</div>
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

                                        {/* Spend Limit (Only for Kids usually, but structure allows flexibility) */}
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
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Tickets ({selectedSeats.length})</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm mb-2 text-green-600 font-medium">
                                        <span>Family Pack (20%)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <Separator className="my-2" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-lg" onClick={handlePay} disabled={isProcessing || !cardName || !email}>
                                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : `Pay $${total.toFixed(2)}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
