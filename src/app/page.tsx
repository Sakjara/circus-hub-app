import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Tent, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShowCard from '@/components/show-card';
import { shows, vendors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import bannerImage from '@/components/images/banner.jpg';

export default function Home() {
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[55vh] md:h-[75vh] w-full -mt-[20%] md:-mt-[5%]">
        <Image
          src={bannerImage}
          alt="Garden Bros Circus Fun Factory"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Upcoming Shows Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
            Upcoming Shows
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
            Don't miss out on our spectacular lineup of events. Book your tickets now for an adventure of a lifetime.
          </p>
          <div className="mt-10 flex flex-wrap items-stretch justify-center gap-8">
            {shows.map((show) => (
              <div key={show.id} className="w-full max-w-sm flex">
                <ShowCard show={show} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/shows">View All Shows</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl">
              {aboutImage && (
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
            </div>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                A Legacy of Entertainment
              </h2>
              <p className="mt-4 text-muted-foreground">
                For generations, Garden Bros Circus has been synonymous with family fun and world-class entertainment. Our commitment is to bring joy and wonder to audiences of all ages, creating memories that last a lifetime.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Star className="h-5 w-5" />
                  </div>
                  <p className="ml-4"><strong>World-Class Performers:</strong> Featuring award-winning acrobats, clowns, and artists from around the globe.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Tent className="h-5 w-5" />
                  </div>
                  <p className="ml-4"><strong>Unforgettable Atmosphere:</strong> The magic of the traditional big top combined with modern production.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary text-primary-foreground p-2 rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="ml-4"><strong>Fun for All Ages:</strong> A perfect outing for the whole family, with something to delight everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
            Our Featured Vendors
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
            Enjoy delicious food, drinks, and memorable souvenirs from our trusted partners.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {vendors.map((vendor) => {
              const vendorImage = PlaceHolderImages.find(img => img.id === vendor.imageId);
              return (
                <Card key={vendor.id} className="text-center border-2 border-transparent hover:border-accent transition-colors duration-300 shadow-lg hover:shadow-2xl">
                  <CardHeader>
                    {vendorImage && (
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                        <Image
                          src={vendorImage.imageUrl}
                          alt={vendor.name}
                          width={96}
                          height={96}
                          className="object-cover"
                          data-ai-hint={vendorImage.imageHint}
                        />
                      </div>
                    )}
                    <CardTitle className="mt-4">{vendor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{vendor.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
