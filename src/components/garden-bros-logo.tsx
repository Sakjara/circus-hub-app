import Image from 'next/image';
import { cn } from "@/lib/utils";
import logo from './images/OficialLogo.png';

export const GardenBrosLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src={logo}
      alt="Garden Bros Circus Logo"
      className={cn("h-[3.5rem] md:h-[5rem] w-auto", className)}
      priority
    />
  );
};
