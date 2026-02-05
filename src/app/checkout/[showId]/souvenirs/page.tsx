'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { vendors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Star, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { use } from 'react';
// ...
export default function SouvenirsPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const productParams = searchParams.getAll('product');
  const souvenirParams = searchParams.getAll('souvenir');

  const [selectedSouvenirs, setSelectedSouvenirs] = useState<string[]>(souvenirParams);

  const souvenirVendors = vendors.filter(v => v.type === 'souvenir');

  const handleCheckboxChange = (vendorId: string, checked: boolean | string) => {
    if (checked) {
      setSelectedSouvenirs(prev => [...prev, vendorId]);
    } else {
      setSelectedSouvenirs(prev => prev.filter(id => id !== vendorId));
    }
  };

  const productsQuery = productParams.map(p => `product=${p}`).join('&');
  const souvenirsQuery = selectedSouvenirs.map(s => `souvenir=${s}`).join('&');
  const nextStepUrl = `/checkout/${showId}/summary?section=${encodeURIComponent(section || '')}${productsQuery ? `&${productsQuery}` : ''}${souvenirsQuery ? `&${souvenirsQuery}` : ''}`;
  const prevStepUrl = `/checkout/${showId}/products?section=${encodeURIComponent(section || '')}${productsQuery ? `&${productsQuery}` : ''}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline text-3xl">
          <Star className="mr-4 h-8 w-8 text-primary" />
          Get Some Souvenirs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">Take a piece of the magic home with you!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {souvenirVendors.map(vendor => {
            const vendorImage = PlaceHolderImages.find(img => img.id === vendor.imageId);
            return (
              <div key={vendor.id} className="flex items-center space-x-4 rounded-lg border p-4">
                {vendorImage && (
                  <Image
                    src={vendorImage.imageUrl}
                    alt={vendor.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                    data-ai-hint={vendorImage.imageHint}
                  />
                )}
                <div className="flex-1 space-y-1">
                  <Label htmlFor={`vendor-${vendor.id}`} className="font-semibold text-lg cursor-pointer">{vendor.name}</Label>
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
                  <p className="font-bold text-primary">${vendor.price.toFixed(2)}</p>
                </div>
                <Checkbox
                  checked={selectedSouvenirs.includes(vendor.id)}
                  id={`vendor-${vendor.id}`}
                  onCheckedChange={(checked) => handleCheckboxChange(vendor.id, checked)}
                  className="h-6 w-6"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="accent" asChild>
          <Link href={prevStepUrl}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/checkout/${showId}/summary?section=${encodeURIComponent(section || '')}${productsQuery ? `&${productsQuery}` : ''}`}>Skip</Link>
          </Button>
          <Button asChild>
            <Link href={nextStepUrl}>
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
