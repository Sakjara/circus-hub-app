import Image from 'next/image';
import { cn } from "@/lib/utils";
import logo from './images/LOGO.png';

export const GardenBrosLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={logo}
      alt="Garden Bros Circus Logo"
      className={cn("h-12 w-auto", className)}
      priority
    />
  );
};
