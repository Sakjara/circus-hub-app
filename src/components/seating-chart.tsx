'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SectionName = 'Rapa Nui' | 'Oceano' | 'Cordillera' | 'Caupolican' | 'Tucapel' | 'Lautaro' | 'Galvarino' | 'Arica' | 'Magallanes';

const seatSections: Record<SectionName, { color: string; price: number }> = {
  'Rapa Nui': { color: 'bg-yellow-400', price: 66.0 },
  'Oceano': { color: 'bg-cyan-400', price: 27.5 },
  'Cordillera': { color: 'bg-red-500', price: 16.5 },
  'Caupolican': { color: 'bg-purple-500', price: 9.9 },
  'Tucapel': { color: 'bg-indigo-700', price: 9.9 },
  'Lautaro': { color: 'bg-orange-500', price: 9.9 },
  'Galvarino': { color: 'bg-blue-600', price: 9.9 },
  'Arica': { color: 'bg-teal-500', price: 9.9 },
  'Magallanes': { color: 'bg-emerald-500', price: 9.9 },
};

const Section = ({ name, className, isSelected, onClick }: { name: SectionName; className?: string; isSelected: boolean; onClick: () => void }) => {
  const sectionData = seatSections[name];
  if (!sectionData) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center text-white font-bold text-[10px] sm:text-xs md:text-sm rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 hover:z-10 focus:outline-none',
        sectionData.color,
        isSelected ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : 'ring-1 ring-black/20',
        className
      )}
    >
      <span className="p-1 whitespace-nowrap">{name}</span>
    </button>
  );
};

export function SeatingChart() {
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);

  const handleSectionClick = (name: SectionName) => {
    setSelectedSection(name === selectedSection ? null : name);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      <div className="flex flex-col items-center">
        <div className="w-full h-10 mb-2 rounded-lg bg-muted flex items-center justify-center">
            <p className="text-center text-sm text-muted-foreground font-headline">STAGE</p>
        </div>
        <div className="grid grid-cols-12 grid-rows-5 gap-1 md:gap-2 w-full" style={{ aspectRatio: '2/1' }}>
          
          {/* First row */}
          <div className="col-start-1 col-span-3 row-start-1 h-full"><Section name="Oceano" isSelected={selectedSection === 'Oceano'} onClick={() => handleSectionClick('Oceano')} className="h-full w-full"/></div>
          <div className="col-start-4 col-span-6 row-start-1 h-full"><Section name="Cordillera" isSelected={selectedSection === 'Cordillera'} onClick={() => handleSectionClick('Cordillera')} className="h-full w-full"/></div>
          <div className="col-start-10 col-span-3 row-start-1 h-full"><Section name="Oceano" isSelected={selectedSection === 'Oceano'} onClick={() => handleSectionClick('Oceano')} className="h-full w-full"/></div>

          {/* Second row */}
          <div className="col-start-1 col-span-2 row-start-2 h-full"><Section name="Caupolican" isSelected={selectedSection === 'Caupolican'} onClick={() => handleSectionClick('Caupolican')} className="h-full w-full"/></div>
          <div className="col-start-11 col-span-2 row-start-2 h-full"><Section name="Rapa Nui" isSelected={selectedSection === 'Rapa Nui'} onClick={() => handleSectionClick('Rapa Nui')} className="h-full w-full"/></div>

           {/* Third row */}
          <div className="col-start-1 col-span-2 row-start-3 h-full"><Section name="Tucapel" isSelected={selectedSection === 'Tucapel'} onClick={() => handleSectionClick('Tucapel')} className="h-full w-full"/></div>
          <div className="col-start-11 col-span-2 row-start-3 h-full"><Section name="Galvarino" isSelected={selectedSection === 'Galvarino'} onClick={() => handleSectionClick('Galvarino')} className="h-full w-full"/></div>

          {/* Bottom row */}
          <div className="col-start-3 col-span-8 row-start-4 row-span-2 grid grid-cols-3 gap-1 md:gap-2 h-full">
            <Section name="Arica" isSelected={selectedSection === 'Arica'} onClick={() => handleSectionClick('Arica')} className="h-full w-full"/>
            <Section name="Lautaro" isSelected={selectedSection === 'Lautaro'} onClick={() => handleSectionClick('Lautaro')} className="h-full w-full"/>
            <Section name="Magallanes" isSelected={selectedSection === 'Magallanes'} onClick={() => handleSectionClick('Magallanes')} className="h-full w-full"/>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs">
          {Object.entries(seatSections).map(([name, { color }]) => (
            <div key={name} className="flex items-center">
              <div className={cn('w-3 h-3 rounded-full mr-1.5', color)}></div>
              <span>{name}</span>
            </div>
          ))}
        </div>

        {selectedSection && seatSections[selectedSection] && (
          <div className="text-center p-4 bg-secondary/30 rounded-lg">
            <h3 className="font-headline text-xl">{selectedSection}</h3>
            <p className="text-lg font-bold text-primary">${seatSections[selectedSection].price.toFixed(2)}</p>
            <p className="text-sm text-green-600 font-semibold">Seats Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
