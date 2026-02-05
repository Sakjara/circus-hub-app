'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { vendors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { use } from 'react';

export default function ProductsPage({ params }: { params: Promise<{ showId: string }> }) {
  const { showId } = use(params);
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const productParams = searchParams.getAll('product');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(productParams);

  const foodVendors = vendors.filter(v => v.type === 'food');

  const handleCheckboxChange = (vendorId: string, checked: boolean | string) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, vendorId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== vendorId));
    }
  };

  const productsQuery = selectedProducts.map(p => `product=${p}`).join('&');
  const nextStepUrl = `/checkout/${showId}/souvenirs?section=${encodeURIComponent(section || '')}${productsQuery ? `&${productsQuery}` : ''}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline text-3xl">
          <ShoppingCart className="mr-4 h-8 w-8 text-primary" />
          Add Snacks & Drinks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">Would you like to add any food or drinks to your order?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodVendors.map(vendor => {
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
                  checked={selectedProducts.includes(vendor.id)}
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
          <Link href={`/shows/${showId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/checkout/${showId}/souvenirs?section=${encodeURIComponent(section || '')}`}>Skip</Link>
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
