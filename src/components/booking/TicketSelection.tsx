'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Ticket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Re-use types or define locally if strictly UI
interface Seat {
    id: string;
    section: string;
    price: number; // Base price (Adult)
    ticketType?: 'Adult' | 'Child' | 'Promo';
    label: string;
}

// Import pricing to ensure consistency or pass as prop?
// Better to pass section type or pricing map.
// For now, let's duplicate the PRICING interface or export it from a shared config.
// Since it's in SeatingChart, let's assume we pass the *Section Type* and lookup prices here
// OR pass the pricing options directly.
// Let's define the pricing structure here for the component to use.

const PRICING_TIERS = {
    VIP: { Adult: 68.07, Child: 47.48, Promo: 36.66 },
    Premium: { Adult: 57.78, Child: 37.17, Promo: null },
    General: { Adult: 47.48, Child: 26.88, Promo: 23.27 }
};

interface TicketSelectionProps {
    selectedSeats: Seat[];
    onConfirm: (seatsWithTypes: Seat[]) => void;
    onBack: () => void;
}

export function TicketSelection({ selectedSeats, onConfirm, onBack }: TicketSelectionProps) {
    const totalSeats = selectedSeats.length;

    // Determine Section Type from the first seat (assuming homogenous selection)
    const sectionName = selectedSeats[0]?.section || 'General';
    let sectionType: 'VIP' | 'Premium' | 'General' = 'General';
    if (sectionName.includes('VIP') || sectionName.includes('Inner')) sectionType = 'VIP';
    else if (sectionName.includes('Premium') || sectionName.includes('Outer')) sectionType = 'Premium';

    const prices = PRICING_TIERS[sectionType];

    // Auto-apply Promo if 4 seats selected in VIP or General (Family Pack / Best Offer)
    const shouldDefaultToPromo = (sectionType === 'VIP' || sectionType === 'General') && totalSeats === 4;

    const [counts, setCounts] = useState({
        Adult: shouldDefaultToPromo ? 0 : totalSeats,
        Child: 0,
        Promo: shouldDefaultToPromo ? 4 : 0
    });

    const currentCount = counts.Adult + counts.Child + counts.Promo;
    const remaining = totalSeats - currentCount;
    const isValid = currentCount === totalSeats;

    const handleIncrement = (type: 'Adult' | 'Child' | 'Promo') => {
        if (currentCount >= totalSeats) return;
        setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type: 'Adult' | 'Child' | 'Promo') => {
        if (counts[type] <= 0) return;
        setCounts(prev => ({ ...prev, [type]: prev[type] - 1 }));
    };

    const calculateTotal = () => {
        return (counts.Adult * prices.Adult) +
            (counts.Child * prices.Child) +
            (counts.Promo * (prices.Promo || 0));
    };

    const handleContinue = () => {
        // Distribute types to seats
        // Create a pool of types
        const types: ('Adult' | 'Child' | 'Promo')[] = [];
        for (let i = 0; i < counts.Adult; i++) types.push('Adult');
        for (let i = 0; i < counts.Child; i++) types.push('Child');
        for (let i = 0; i < counts.Promo; i++) types.push('Promo');

        const updatedSeats = selectedSeats.map((seat, index) => ({
            ...seat,
            ticketType: types[index],
            price: prices[types[index]] || 0,
            label: `${types[index]} - ${seat.label.split(' - ').pop()}`
        }));

        onConfirm(updatedSeats);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 text-slate-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-500 hover:text-white transition-all shadow-none hover:shadow-md"
            >
                ← Back to Map
            </Button>

            <Card className="shadow-xl border-slate-200">
                <CardHeader className="bg-slate-50 border-b">
                    <CardTitle className="flex justify-between items-center">
                        <span>Select Ticket Types</span>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {sectionType} Section
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        You have selected <strong>{totalSeats}</strong> seats. Please assign a ticket type to each.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">

                    {/* Adult Option */}
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 transition-colors bg-white">
                        <div>
                            <div className="font-bold text-lg">Adult</div>
                            <div className="text-muted-foreground">${prices.Adult.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleDecrement('Adult')} disabled={counts.Adult === 0}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg">{counts.Adult}</span>
                            <Button variant="outline" size="icon" onClick={() => handleIncrement('Adult')} disabled={currentCount >= totalSeats}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Child Option */}
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-violet-300 transition-colors bg-white">
                        <div>
                            <div className="font-bold text-lg">Child <span className="text-xs font-normal text-muted-foreground">(Ages 3-13)</span></div>
                            <div className="text-muted-foreground">${prices.Child.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleDecrement('Child')} disabled={counts.Child === 0}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg">{counts.Child}</span>
                            <Button variant="outline" size="icon" onClick={() => handleIncrement('Child')} disabled={currentCount >= totalSeats}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Promo Option */}
                    {prices.Promo !== null && (
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:border-rose-300 transition-colors bg-white border-dashed border-rose-200">
                            <div>
                                <div className="font-bold text-lg text-rose-600 flex items-center gap-2">
                                    Promo / Discount <Ticket className="w-4 h-4" />
                                </div>
                                <div className="text-rose-500 font-medium">${prices.Promo.toFixed(2)}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {sectionType === 'VIP' ? 'Family Pack Rate' : 'Limited Availability'}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" onClick={() => handleDecrement('Promo')} disabled={counts.Promo === 0}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-lg">{counts.Promo}</span>
                                <Button variant="outline" size="icon" onClick={() => handleIncrement('Promo')} disabled={currentCount >= totalSeats}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {remaining > 0 && (
                        <div className="text-center text-amber-600 font-medium animate-pulse">
                            Please assign types to {remaining} more seat{remaining > 1 ? 's' : ''}.
                        </div>
                    )}
                    {remaining < 0 && (
                        <div className="text-center text-red-600 font-medium">
                            You have assigned too many tickets! Please remove {Math.abs(remaining)}.
                        </div>
                    )}

                </CardContent>
                <CardFooter className="p-6 flex justify-between items-center bg-slate-50 border-t">
                    <div className="text-xl font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <Button
                        size="lg"
                        variant="accent"
                        onClick={handleContinue}
                        disabled={!isValid}
                        className={cn(
                            "min-w-[150px] transition-all font-bold shadow-lg",
                            !isValid && "opacity-50 cursor-not-allowed bg-slate-300 pointer-events-none"
                        )}
                    >
                        Continue
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
