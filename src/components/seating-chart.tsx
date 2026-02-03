'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SectionCategory = 'VIP' | 'Premium' | 'General';

type SectionName = 
  | 'Golden Circle' 
  | 'Orchestra Center' 
  | 'Orchestra Wings' 
  | 'Mezzanine Center'
  | 'Mezzanine Sides'
  | 'Balcony Center'
  | 'Balcony Wings';

const seatSections: Record<SectionName, { category: SectionCategory; color: string; price: number }> = {
  // VIP
  'Golden Circle': { category: 'VIP', color: 'bg-yellow-400 text-black', price: 150.0 },
  'Orchestra Center': { category: 'VIP', color: 'bg-yellow-500 text-black', price: 120.0 },

  // Premium
  'Orchestra Wings': { category: 'Premium', color: 'bg-red-500 text-white', price: 95.0 },
  'Mezzanine Center': { category: 'Premium', color: 'bg-red-600 text-white', price: 85.0 },
  
  // General
  'Mezzanine Sides': { category: 'General', color: 'bg-blue-600 text-white', price: 60.0 },
  'Balcony Center': { category: 'General', color: 'bg-blue-700 text-white', price: 50.0 },
  'Balcony Wings': { category: 'General', color: 'bg-blue-800 text-white', price: 45.0 },
};

const categories: Record<SectionCategory, { color: string; names: SectionName[] }> = {
    'VIP': { color: 'bg-yellow-400', names: ['Golden Circle', 'Orchestra Center'] },
    'Premium': { color: 'bg-red-500', names: ['Orchestra Wings', 'Mezzanine Center'] },
    'General': { color: 'bg-blue-600', names: ['Mezzanine Sides', 'Balcony Center', 'Balcony Wings'] }
}

const Section = ({ name, className, isSelected, onClick }: { name: SectionName; className?: string; isSelected: boolean; onClick: () => void }) => {
  const sectionData = seatSections[name];
  if (!sectionData) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:z-10 focus:outline-none h-full w-full',
        sectionData.color,
        isSelected ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : 'ring-1 ring-black/20',
        className
      )}
    >
      <span className="p-1 text-center leading-tight">{name}</span>
    </button>
  );
};

export function SeatingChart() {
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);

  const handleSectionClick = (name: SectionName) => {
    setSelectedSection(name === selectedSection ? null : name);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        
        {/* Stage */}
        <div className="w-full md:w-auto flex items-center justify-center p-4 bg-muted rounded-lg order-2 md:order-1">
          <div className="md:transform md:-rotate-90">
            <p className="text-center text-lg text-muted-foreground font-headline tracking-widest">
              S T A G E
            </p>
          </div>
        </div>

        {/* Seating Grid */}
        <div className="order-1 md:order-2 grid grid-cols-5 grid-rows-5 gap-1.5 w-full max-w-[450px] aspect-[1]">
            {/* Top Row (Balconies) */}
            <div className="col-start-1 col-span-2"><Section name="Balcony Wings" isSelected={selectedSection === 'Balcony Wings'} onClick={() => handleSectionClick('Balcony Wings')} /></div>
            <div className="col-start-3 col-span-1"><Section name="Balcony Center" isSelected={selectedSection === 'Balcony Center'} onClick={() => handleSectionClick('Balcony Center')} /></div>
            <div className="col-start-4 col-span-2"><Section name="Balcony Wings" isSelected={selectedSection === 'Balcony Wings'} onClick={() => handleSectionClick('Balcony Wings')} /></div>

            {/* Left Arm of U */}
            <div className="col-start-1 col-span-1 row-start-2 row-span-3"><Section name="Mezzanine Sides" isSelected={selectedSection === 'Mezzanine Sides'} onClick={() => handleSectionClick('Mezzanine Sides')} /></div>

            {/* Center Area */}
            <div className="col-start-2 col-span-3 row-start-2"><Section name="Mezzanine Center" isSelected={selectedSection === 'Mezzanine Center'} onClick={() => handleSectionClick('Mezzanine Center')} /></div>
            <div className="col-start-2 col-span-3 row-start-3"><Section name="Orchestra Center" isSelected={selectedSection === 'Orchestra Center'} onClick={() => handleSectionClick('Orchestra Center')} /></div>
            <div className="col-start-2 col-span-3 row-start-4"><Section name="Golden Circle" isSelected={selectedSection === 'Golden Circle'} onClick={() => handleSectionClick('Golden Circle')} /></div>
            
            {/* Right Arm of U */}
            <div className="col-start-5 col-span-1 row-start-2 row-span-3"><Section name="Mezzanine Sides" isSelected={selectedSection === 'Mezzanine Sides'} onClick={() => handleSectionClick('Mezzanine Sides')} /></div>

            {/* Bottom Row */}
            <div className="col-start-1 col-span-5 row-start-5"><Section name="Orchestra Wings" isSelected={selectedSection === 'Orchestra Wings'} onClick={() => handleSectionClick('Orchestra Wings')} /></div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
          {Object.entries(categories).map(([category, { color }]) => (
            <div key={category} className="flex items-center">
              <div className={cn('w-4 h-4 rounded-full mr-2 border border-black/20', color)}></div>
              <span className="font-semibold">{category}</span>
            </div>
          ))}
        </div>

        {selectedSection && seatSections[selectedSection] && (
          <div className="text-center p-4 bg-secondary/30 rounded-lg max-w-sm mx-auto">
            <h3 className="font-headline text-xl">{selectedSection}</h3>
            <p className="text-lg font-bold text-primary">${seatSections[selectedSection].price.toFixed(2)}</p>
            <p className="text-sm text-green-600 font-semibold">Seats Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
