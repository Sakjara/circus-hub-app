'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Ticket, Sparkles, Gift } from 'lucide-react';
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

    // State for showing "almost there" toast
    const [showAlmostThereToast, setShowAlmostThereToast] = useState(false);

    // Show toast when exactly 3 seats are selected (and promo is available)
    useEffect(() => {
        if (totalSeats === 3 && prices.Promo !== null) {
            setShowAlmostThereToast(true);
            // Auto-hide after 5 seconds
            const timer = setTimeout(() => setShowAlmostThereToast(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowAlmostThereToast(false);
        }
    }, [totalSeats, prices.Promo]);

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
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* "Almost There" Toast - Shows when 3 seats selected */}
            {showAlmostThereToast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-500">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-lg shadow-2xl max-w-sm border-2 border-amber-400">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-amber-500" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">🎉 ¡Casi lo logras!</h3>
                                <p className="text-sm text-amber-50">
                                    Selecciona <strong>1 asiento más</strong> y desbloquea descuentos grupales especiales
                                </p>
                                <p className="text-xs text-amber-100 mt-2">
                                    💰 Ahorra hasta ${((prices.Adult - (prices.Promo || 0)) * 4).toFixed(2)} en 4 tickets
                                </p>
                            </div>
                            <button
                                onClick={() => setShowAlmostThereToast(false)}
                                className="flex-shrink-0 text-white hover:text-amber-100 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 text-slate-600 hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-500 hover:text-white transition-all shadow-none hover:shadow-md"
            >
                ← Back to Map
            </Button>

            <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Select Ticket Types</CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {sectionType} Section
                        </Badge>
                    </div>
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

                    {/* Incentive Banner - Show when less than 4 seats */}
                    {totalSeats < 4 && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Gift className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-blue-900 text-sm">💡 Unlock Group Discounts!</p>
                                    <p className="text-blue-700 text-xs mt-1">
                                        Select <strong>4 or more seats</strong> to access special promotional pricing
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message - Show when 4+ seats selected */}
                    {totalSeats >= 4 && prices.Promo !== null && (
                        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-green-600" />
                                <p className="font-semibold text-green-900 text-sm">🎉 Group Discount Unlocked!</p>
                            </div>
                        </div>
                    )}

                    {/* Promo Option - Only show if 4+ seats */}
                    {totalSeats >= 4 && prices.Promo !== null && (
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
