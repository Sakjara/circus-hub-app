'use client';

import Link from 'next/link';
import { Home, Menu, Tent, Ticket, User, Shield, ChevronDown, Sparkles, Gamepad2, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { GardenBrosLogo } from '@/components/garden-bros-logo';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shows', label: 'Shows', icon: Tent },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/experience', label: 'Experience', icon: Sparkles },
  { href: '/fun-games', label: 'Fun & Games', icon: Gamepad2 },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="dark z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 md:h-24 items-center">

        {/* Left side */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <GardenBrosLogo />
          </Link>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center justify-center">
          <div className="flex space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-white',
                  pathname === link.href ? 'text-white' : 'text-white/90'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex-1 flex justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="dark bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col space-y-4 pt-6">
                  <Link href="/" className="flex items-center space-x-2 mb-4">
                    <GardenBrosLogo />
                  </Link>
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-2 rounded-md p-2 text-white hover:bg-accent"
                      >
                        {link.icon && <link.icon className="h-5 w-5" />}
                        <span>{link.label}</span>
                      </Link>
                    </div>
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
