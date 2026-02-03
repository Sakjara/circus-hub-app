import Image from 'next/image';
import { cn } from "@/lib/utils";

export const GardenBrosLogo = ({ className }: { className?: string }) => {
  return (
    <Image
      src="https://www.gardenbrosnuclearcircus.com/wp-content/uploads/2023/10/logo.png"
      alt="Garden Bros Circus Logo"
      width={751}
      height={358}
      className={cn("h-12 w-auto", className)}
      priority
    />
  );
};
