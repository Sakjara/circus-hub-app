'use client';

import { useSearchParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shows, vendors } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Gift, Ticket, ArrowLeft } from 'lucide-react';
import { seatSections } from '@/components/seating-chart';
import { useToast } from '@/hooks/use-toast';

import { use } from 'react';

export default function SummaryPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const section = searchParams.get('section');
  const productIds = searchParams.getAll('product');
  const souvenirIds = searchParams.getAll('souvenir');

  const show = shows.find(s => s.id === showId);

  if (!show || !section || !(section in seatSections)) {
    notFound();
  }

  const sectionDetails = seatSections[section as keyof typeof seatSections];
  const ticketPrice = sectionDetails.price;

  const selectedProducts = productIds.map(id => vendors.find(v => v.id === id)).filter((v): v is NonNullable<typeof v> => !!v);
  const selectedSouvenirs = souvenirIds.map(id => vendors.find(v => v.id === id)).filter((v): v is NonNullable<typeof v> => !!v);

  const productsTotal = selectedProducts.reduce((acc, item) => acc + (item?.price || 0), 0);
  const souvenirsTotal = selectedSouvenirs.reduce((acc, item) => acc + (item?.price || 0), 0);
  const total = ticketPrice + productsTotal + souvenirsTotal;

  const productsQuery = productIds.map(id => `product=${id}`).join('&');
  const souvenirsQuery = souvenirIds.map(id => `souvenir=${id}`).join('&');
  const prevStepUrl = `/checkout/${showId}/souvenirs?section=${encodeURIComponent(section || '')}${productsQuery ? `&${productsQuery}` : ''}${souvenirsQuery ? `&${souvenirsQuery}` : ''}`;

  const handleCompletePurchase = () => {
    // In a real app, this would process the payment.
    // Here we'll just show a success message and redirect.
    toast({
      title: "Purchase Complete!",
      description: "Your tickets are on their way. Enjoy the show!",
    });
    router.push('/tickets');
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center font-headline text-3xl">
          <CheckCircle className="mr-4 h-8 w-8 text-green-500" />
          Order Summary
        </CardTitle>
        <CardDescription>Review your order before completing the purchase.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ticket */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg flex items-center"><Ticket className="mr-2 h-5 w-5 text-primary" />Your Ticket</h3>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-bold">{show.title}</p>
              <p className="text-sm text-muted-foreground">Section: <span className="font-medium text-foreground">{section}</span></p>
            </div>
            <p className="font-bold text-lg">${ticketPrice.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        {/* Products */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary" />Snacks & Drinks</h3>
          {selectedProducts.length > 0 ? (
            <ul className="space-y-1 text-muted-foreground">
              {selectedProducts.map(item => item && (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No snacks or drinks added.</p>}
        </div>

        <Separator />

        {/* Souvenirs */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg flex items-center"><Gift className="mr-2 h-5 w-5 text-primary" />Souvenirs</h3>
          {selectedSouvenirs.length > 0 ? (
            <ul className="space-y-1 text-muted-foreground">
              {selectedSouvenirs.map(item => item && (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted-foreground">No souvenirs added.</p>}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center font-bold text-2xl pt-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center space-x-4">
        <Button variant="accent" asChild>
          <Link href={prevStepUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <Button size="lg" className="w-full" onClick={handleCompletePurchase}>
            Complete Purchase
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
