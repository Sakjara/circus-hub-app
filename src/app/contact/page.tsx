'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { AdvertiseForm } from '@/components/forms/advertise-form';
import { BookingForm } from '@/components/forms/booking-form';
import { SupportForm } from '@/components/forms/support-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ContactContent() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const [activeTab, setActiveTab] = useState('advertise');

    useEffect(() => {
        if (typeParam && ['advertise', 'booking', 'support'].includes(typeParam)) {
            setActiveTab(typeParam);
        }
    }, [typeParam]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Optional: Update URL without reload if desired
        const url = new URL(window.location.href);
        url.searchParams.set('type', value);
        window.history.pushState({}, '', url);
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Contact Us</h1>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="advertise">Advertise With Us</TabsTrigger>
                    <TabsTrigger value="booking">Book Our Show</TabsTrigger>
                    <TabsTrigger value="support">Customer Support</TabsTrigger>
                </TabsList>

                <TabsContent value="advertise">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Advertising Request Form</CardTitle>
                            <CardDescription>
                                Interested in advertising with Garden Bros Circus? Fill out the form below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdvertiseForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="booking">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Booking Request Form</CardTitle>
                            <CardDescription>
                                Want to bring the Garden Bros Circus to your city? Let us know!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BookingForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="support">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Contact Support</CardTitle>
                            <CardDescription>
                                Have a question or need assistance? We are here to help.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SupportForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactContent />
        </Suspense>
    );
}
