"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Tent, Users, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShowCard from '@/components/show-card';
import { shows, vendors } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import bannerImage from '@/components/images/banner.jpg';
import nuclearImage from '@/components/images/nuclear.jpg';
import nuclear2Image from '@/components/images/nuclear2.jpg';
import nuclear3Image from '@/components/images/nuclear3.jpg';
import girlFlyImage from '@/components/images/girlfly.png';
import funFactoryImage from '@/components/images/funFactory.jpg';
import funFactory1Image from '@/components/images/funFactory1.jpg';
import funFactory2Image from '@/components/images/funFactory2.jpg';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { FadeIn } from "@/components/ui/fade-in"
import { FizzyButton } from "@/components/ui/fizzy-button"
import { InteractiveHoverText } from "@/components/ui/interactive-hover-text"

import { useState, useEffect } from 'react';

// ... existing imports

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const aboutImage = PlaceHolderImages.find((img) => img.id === 'about');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[80vh] xl:h-[85vh] w-full -mt-[20%] md:-mt-[6%]">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
          <Image
            src={bannerImage}
            alt="Garden Bros Circus Fun Factory"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
          {showVideo && (
            <>
              {/* Mobile Video (9:16) */}
              <video
                src="https://impulso-digital.cl/wp-content/uploads/2026/02/Circus_short_v3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="md:hidden object-cover w-full h-full"
              />
              {/* Desktop Video (16:9) */}
              <video
                src="https://impulso-digital.cl/wp-content/uploads/2026/02/Garden_Bros_Nuclear_Circus_v3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hidden md:block object-cover w-full h-full"
              />
            </>
          )}
        </div>
      </section>

      {/* Welcome Era Section */}
      <section className="relative py-4 md:py-4 xl:pt-12 xl:pb-4 bg-black text-white overflow-visible -mt-1">
        {/* Floating CTA Button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-fit px-4">
          <FizzyButton href="/shows" className="w-full sm:w-auto">
            Get your Tickets
          </FizzyButton>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-screen-2xl">
          <div className="grid md:grid-cols-[60%_40%] xl:grid-cols-[55%_45%] gap-4 md:gap-6 items-center">
            {/* Text Content */}
            <div className="text-center md:text-left pt-8 md:pt-0">
              <InteractiveHoverText
                text="Welcome to a New Era"
                className="font-headline text-[clamp(1.5rem,4vw,4rem)] font-bold uppercase tracking-tight mb-2 whitespace-nowrap leading-tight"
                textClassName="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600"
              />
              <h3 className="font-headline text-[clamp(1.6rem,3vw,4rem)] font-bold uppercase tracking-wide text-white mb-6 whitespace-nowrap leading-tight">
                of Garden Bros Circus
              </h3>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
                Open your world to more wonders. Experience the inspiration like never before with our completely reimagined 5-ring spectacle.
              </p>
            </div>

            {/* Artistic Circular Image */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-80 h-80 md:w-72 md:h-72 lg:w-96 lg:h-96 xl:w-[40rem] xl:h-[40rem] mt-4 md:mt-1 xl:-mt-8">
                <Image
                  src={girlFlyImage}
                  alt="Artistic Circus Performer"
                  fill
                  className="object-cover scale-110 animate-float"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent mix-blend-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Shows Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <FadeIn direction="up">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center">
              Upcoming Shows
            </h2>
            <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">
              Don't miss out on our spectacular lineup of events. Book your tickets now for an adventure of a lifetime.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} direction="up" className="mt-10 flex flex-wrap items-stretch justify-center gap-8">
            {shows.map((show) => (
              <div key={show.id} className="w-full max-w-md flex">
                <ShowCard show={show} />
              </div>
            ))}
          </FadeIn>
          <div className="text-center mt-12">
            <Button asChild variant="accent">
              <Link href="/shows">View All Shows</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Detailed Show Sections */}
      <section className="py-12 md:py-24 bg-secondary/10">
        <div className="container mx-auto px-4">

          {/* Nuclear Circus Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <FadeIn direction="right" className="relative">
              <Carousel
                className="w-full mx-auto shadow-2xl rounded-xl"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent>
                  {[nuclearImage, nuclear2Image, nuclear3Image].map((imgSrc, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                        <Image
                          src={imgSrc}
                          alt={`Nuclear Circus Stunt ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              {/* Deco element */}
              <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full border-2 border-accent/30 rounded-xl"></div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="flex flex-col justify-center h-full">
              <h2 className="font-headline text-5xl md:text-6xl font-bold mb-8 text-primary">Nuclear Circus</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Garden Bros Nuclear Circus delivers non-stop action with 60+ world-class performers, a 5-ring layout for unbeatable views, concert-style lights and sound, and a smooth, fast-moving show built for all ages.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-lg"><Star className="h-6 w-6 text-accent mr-4 fill-accent/20" /> High-octane thrill ride</li>
                <li className="flex items-center text-lg"><Star className="h-6 w-6 text-accent mr-4 fill-accent/20" /> Mind-blowing stunts</li>
                <li className="flex items-center text-lg"><Star className="h-6 w-6 text-accent mr-4 fill-accent/20" /> 5-ring spectacle</li>
              </ul>
              <div>
                <Button asChild size="lg" variant="accent" className="text-lg px-8 py-6">
                  <Link href="/shows/2">Learn More</Link>
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Elegant Divider */}
          <FadeIn delay={0.3} className="relative flex items-center justify-center my-24">
            <div className="absolute w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
            <div className="relative z-10 px-4 bg-background">
              <Star className="h-8 w-8 text-accent fill-accent" />
            </div>
          </FadeIn>

          {/* Fun Factory Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" className="order-2 lg:order-1 flex flex-col justify-center h-full">
              <h2 className="font-headline text-5xl md:text-6xl font-bold mb-8 text-primary">Fun Factory</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Humans Gone Wild! A whimsical world of fun, laughs, and pure entertainment. This show is a delightful explosion of colors, comedy, and crazy contraptions perfect for the whole family.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-lg"><Tent className="h-6 w-6 text-accent mr-4 fill-accent/20" /> Whimsical world of fun</li>
                <li className="flex items-center text-lg"><Tent className="h-6 w-6 text-accent mr-4 fill-accent/20" /> 60+ performers</li>
                <li className="flex items-center text-lg"><Tent className="h-6 w-6 text-accent mr-4 fill-accent/20" /> Clowns and comedy</li>
              </ul>
              <div>
                <Button asChild size="lg" variant="accent" className="text-lg px-8 py-6">
                  <Link href="/shows/1">Learn More</Link>
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="relative order-1 lg:order-2">
              <Carousel
                className="w-full mx-auto shadow-2xl rounded-xl"
                plugins={[
                  Autoplay({
                    delay: 3000,
                  }),
                ]}
              >
                <CarouselContent>
                  {[funFactoryImage, funFactory1Image, funFactory2Image].map((imgSrc, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                        <Image
                          src={imgSrc}
                          alt={`Fun Factory Performance ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              {/* Deco element */}
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-accent/30 rounded-xl"></div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" className="rounded-lg overflow-hidden shadow-xl">
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
            </FadeIn>
            <FadeIn direction="left" delay={0.2}>
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
            </FadeIn>
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
