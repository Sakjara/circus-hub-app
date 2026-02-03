'use client';
import { cn } from '@/lib/utils';

type SectionCategory = 'VIP' | 'Premium' | 'General';

export type SectionName = 
  | 'VIP Top'
  | 'VIP Right'
  | 'VIP Bottom'
  | 'Premium Top'
  | 'Premium Right'
  | 'Premium Bottom'
  | 'General Top'
  | 'General Right'
  | 'General Bottom';

export const seatSections: Record<SectionName, { category: SectionCategory; color: string; price: number }> = {
  // VIP
  'VIP Top':    { category: 'VIP', color: 'bg-yellow-400 text-black', price: 150.0 },
  'VIP Right':  { category: 'VIP', color: 'bg-yellow-500 text-black', price: 150.0 },
  'VIP Bottom': { category: 'VIP', color: 'bg-yellow-400 text-black', price: 150.0 },

  // Premium
  'Premium Top':    { category: 'Premium', color: 'bg-red-500 text-white', price: 95.0 },
  'Premium Right':  { category: 'Premium', color: 'bg-red-600 text-white', price: 95.0 },
  'Premium Bottom': { category: 'Premium', color: 'bg-red-500 text-white', price: 95.0 },
  
  // General
  'General Top':    { category: 'General', color: 'bg-blue-600 text-white', price: 60.0 },
  'General Right':  { category: 'General', color: 'bg-blue-700 text-white', price: 60.0 },
  'General Bottom': { category: 'General', color: 'bg-blue-600 text-white', price: 60.0 },
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
        'relative flex items-center justify-center font-bold text-[8px] sm:text-xs rounded-sm cursor-pointer transition-all duration-200 transform hover:scale-105 hover:z-10 focus:outline-none h-full w-full shadow-sm',
        sectionData.color,
        isSelected ? 'ring-4 ring-offset-2 ring-offset-background ring-primary' : 'ring-1 ring-black/20',
        className
      )}
    >
      <span className="p-1 text-center leading-tight">{name}</span>
    </button>
  );
};

export function SeatingChart({ onSectionSelect, selectedSection }: { onSectionSelect: (section: SectionName | null) => void; selectedSection: SectionName | null; }) {

  const handleSectionClick = (name: SectionName) => {
    onSectionSelect(name === selectedSection ? null : name);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4">
       <div className="grid grid-cols-12 grid-rows-12 gap-1.5 w-full max-w-[700px] aspect-square mx-auto">
        
        {/* Stage */}
        <div className="col-start-1 col-span-2 row-start-5 row-span-4 bg-muted rounded-lg flex items-center justify-center shadow-inner">
          <p className="font-headline text-lg text-muted-foreground tracking-widest -rotate-90">
            STAGE
          </p>
        </div>

        {/* VIP Seats */}
        <div className="col-start-3 col-span-7 row-start-5 row-span-1"><Section name="VIP Top" isSelected={selectedSection === 'VIP Top'} onClick={() => handleSectionClick('VIP Top')} /></div>
        <div className="col-start-3 col-span-7 row-start-8 row-span-1"><Section name="VIP Bottom" isSelected={selectedSection === 'VIP Bottom'} onClick={() => handleSectionClick('VIP Bottom')} /></div>
        <div className="col-start-10 col-span-1 row-start-5 row-span-4"><Section name="VIP Right" isSelected={selectedSection === 'VIP Right'} onClick={() => handleSectionClick('VIP Right')} /></div>

        {/* Premium Seats */}
        <div className="col-start-3 col-span-8 row-start-3 row-span-2"><Section name="Premium Top" isSelected={selectedSection === 'Premium Top'} onClick={() => handleSectionClick('Premium Top')} /></div>
        <div className="col-start-3 col-span-8 row-start-9 row-span-2"><Section name="Premium Bottom" isSelected={selectedSection === 'Premium Bottom'} onClick={() => handleSectionClick('Premium Bottom')} /></div>
        <div className="col-start-11 col-span-1 row-start-3 row-span-8"><Section name="Premium Right" isSelected={selectedSection === 'Premium Right'} onClick={() => handleSectionClick('Premium Right')} /></div>

        {/* General Seats */}
        <div className="col-start-3 col-span-10 row-start-1 row-span-2"><Section name="General Top" isSelected={selectedSection === 'General Top'} onClick={() => handleSectionClick('General Top')} /></div>
        <div className="col-start-3 col-span-10 row-start-11 row-span-2"><Section name="General Bottom" isSelected={selectedSection === 'General Bottom'} onClick={() => handleSectionClick('General Bottom')} /></div>
        <div className="col-start-12 col-span-1 row-start-1 row-span-12"><Section name="General Right" isSelected={selectedSection === 'General Right'} onClick={() => handleSectionClick('General Right')} /></div>
        
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
