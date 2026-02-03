import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Show } from '@/lib/types';
import { Badge } from './ui/badge';

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const showImage = PlaceHolderImages.find((img) => img.id === show.imageId);
  const showDate = new Date(show.date);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        {showImage && (
          <Image
            src={showImage.imageUrl}
            alt={show.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint={showImage.imageHint}
          />
        )}
        <Badge variant="secondary" className="absolute top-2 right-2">${show.price.toFixed(2)}</Badge>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-2xl mb-2">{show.title}</CardTitle>
        <p className="text-muted-foreground text-sm mb-4">{show.description}</p>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(showDate, 'MMMM d, yyyy \'at\' h:mm a')}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{show.venue}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={`/shows/${show.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
