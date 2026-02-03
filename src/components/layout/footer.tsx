import Link from 'next/link';
import { GardenBrosLogo } from '@/components/garden-bros-logo';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'Twitter', href: '#' },
];

export default function Footer() {
  return (
    <footer className="dark border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GardenBrosLogo />
          </div>
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Garden Bros Circus. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-2">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="ghost" size="icon" asChild>
                <Link href={link.href} aria-label={link.name}>
                  {/* In a real app, you'd use specific social icons */}
                  <div className="w-4 h-4 rounded-full bg-muted-foreground/50" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
