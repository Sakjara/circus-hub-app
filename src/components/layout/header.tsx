'use client';

import Link from 'next/link';
import { Menu, Tent, Ticket, User, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { GardenBrosLogo } from '@/components/garden-bros-logo';

const navLinks = [
  { href: '/shows', label: 'Shows', icon: Tent },
  { href: '/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin/validate', label: 'Admin', icon: Shield },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="dark sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-24 items-center">
        <div className="flex flex-1 justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <GardenBrosLogo />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="dark">
                <div className="flex flex-col space-y-4 pt-6">
                  <Link href="/" className="flex items-center space-x-2 mb-4">
                     <GardenBrosLogo />
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Button className="hidden md:inline-flex" asChild>
            <Link href="/shows">Buy Tickets</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
