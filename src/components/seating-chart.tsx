'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SectionCategory = 'VIP' | 'Premium' | 'General';

// New, more descriptive section names
type SectionName = 
  | 'Front Stage VIP'
  | 'VIP Wings'
  | 'Premium Orchestra'
  | 'Premium Wings'
  | 'General Admission Sides'
  | 'General Admission Rear';

const seatSections: Record<SectionName, { category: SectionCategory; color: string; price: number }> = {
  // VIP
  'Front Stage VIP': { category: 'VIP', color: 'bg-yellow-400 text-black', price: 150.0 },
  'VIP Wings': { category: 'VIP', color: 'bg-yellow-500 text-black', price: 135.0 },

  // Premium
  'Premium Orchestra': { category: 'Premium', color: 'bg-red-500 text-white', price: 95.0 },
  'Premium Wings': { category: 'Premium', color: 'bg-red-600 text-white', price: 85.0 },
  
  // General
  'General Admission Sides': { category: 'General', color: 'bg-blue-600 text-white', price: 60.0 },
  'General Admission Rear': { category: 'General', color: 'bg-blue-700 text-white', price: 50.0 },
};

const categories: Record<SectionCategory, { color: string }> = {
    'VIP': { color: 'bg-yellow-400' },
    'Premium': { color: 'bg-red-500' },
    'General': { color: 'bg-blue-600' }
}

const Section = ({ name, className, isSelected, onClick }: { name: SectionName; className?: string; isSelected: boolean; onClick: () => void }) => {
  const sectionData = seatSections[name];
  if (!sectionData) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center font-bold text-[8px] sm:text-xs rounded-md cursor-pointer transition-all duration-200 transform hover:scale-105 hover:z-10 focus:outline-none h-full w-full shadow-sm',
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
      {/* Seating Grid using a 10x10 grid for layout */}
      <div className="grid grid-cols-10 grid-rows-10 gap-1.5 w-full max-w-[700px] aspect-square mx-auto">
        
        {/* Stage */}
        <div className="col-start-4 col-span-4 row-start-5 row-span-2 bg-muted rounded-lg flex items-center justify-center shadow-inner">
          <p className="font-headline text-lg text-muted-foreground tracking-widest">
            S T A G E
          </p>
        </div>

        {/* General Admission */}
        <div className="col-start-1 col-span-10 row-start-1 row-span-2"><Section name="General Admission Rear" isSelected={selectedSection === 'General Admission Rear'} onClick={() => handleSectionClick('General Admission Rear')} /></div>
        <div className="col-start-1 col-span-10 row-start-9 row-span-2"><Section name="General Admission Rear" isSelected={selectedSection === 'General Admission Rear'} onClick={() => handleSectionClick('General Admission Rear')} /></div>
        <div className="col-start-1 col-span-2 row-start-3 row-span-6"><Section name="General Admission Sides" isSelected={selectedSection === 'General Admission Sides'} onClick={() => handleSectionClick('General Admission Sides')} /></div>
        
        {/* Premium */}
        <div className="col-start-3 col-span-6 row-start-3 row-span-1"><Section name="Premium Orchestra" isSelected={selectedSection === 'Premium Orchestra'} onClick={() => handleSectionClick('Premium Orchestra')} /></div>
        <div className="col-start-3 col-span-6 row-start-8 row-span-1"><Section name="Premium Orchestra" isSelected={selectedSection === 'Premium Orchestra'} onClick={() => handleSectionClick('Premium Orchestra')} /></div>
        <div className="col-start-9 col-span-2 row-start-3 row-span-6"><Section name="Premium Wings" isSelected={selectedSection === 'Premium Wings'} onClick={() => handleSectionClick('Premium Wings')} /></div>
        
        {/* VIP */}
        <div className="col-start-4 col-span-4 row-start-4 row-span-1"><Section name="Front Stage VIP" isSelected={selectedSection === 'Front Stage VIP'} onClick={() => handleSectionClick('Front Stage VIP')} /></div>
        <div className="col-start-4 col-span-4 row-start-7 row-span-1"><Section name="Front Stage VIP" isSelected={selectedSection === 'Front Stage VIP'} onClick={() => handleSectionClick('Front Stage VIP')} /></div>
        <div className="col-start-8 col-span-1 row-start-4 row-span-4"><Section name="VIP Wings" isSelected={selectedSection === 'VIP Wings'} onClick={() => handleSectionClick('VIP Wings')} /></div>
        
      </div>

      {/* Legend and Info */}
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
          <div className="text-center p-4 bg-secondary/30 rounded-lg max-w-sm mx-auto mt-4">
            <h3 className="font-headline text-xl">{selectedSection}</h3>
            <p className="text-lg font-bold text-primary">${seatSections[selectedSection].price.toFixed(2)}</p>
            <p className="text-sm text-green-600 font-semibold">Seats Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
