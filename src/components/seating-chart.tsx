'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types ---
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

interface Seat {
  id: string;
  x: number;
  y: number;
  r: number;
  section: string;
  color: string;
  status: 'available' | 'occupied' | 'selected';
  price: number;
  label: string;
}

// --- Configuration ---
const SEAT_RADIUS = 3;
const SPACING_X = 8;
const SPACING_Y = 8;
const AISLE_GAP = 12; // Gap between Red and Blue

// Colors
const COLORS = {
  VIP: '#FFD700',      // Yellow (Front)
  Premium: '#EF4444',  // Red (Middle)
  General: '#3B82F6',  // Blue (Back)
  Stage: '#e4e4e7',
};

const PRICES = {
  VIP: 150,
  Premium: 95,
  General: 60
};

// --- Geometry Helpers ---

const createSection = (
  sectionName: string,
  startX: number,
  startY: number,
  rows: number,
  cols: number[],
  rowSpacing: number,
  colSpacing: number,
  rotation: number = 0,
  overrideType?: 'VIP' | 'Premium' | 'General'
): Seat[] => {
  const seats: Seat[] = [];
  const rad = (rotation * Math.PI) / 180;

  for (let r = 0; r < rows; r++) {
    const rowCols = cols[r] || cols[0];

    // Determine Category
    let color = COLORS.General;
    let type = 'General';
    let price = PRICES.General;
    let yOffset = 0;

    if (overrideType) {
      type = overrideType;
      color = COLORS[overrideType];
      price = PRICES[overrideType];
    } else {
      if (r < 3) {
        color = COLORS.VIP;
        type = 'VIP';
        price = PRICES.VIP;
      } else if (r < 7) {
        color = COLORS.Premium;
        type = 'Premium';
        price = PRICES.Premium;
      } else {
        // GENERAL (Blue)
        yOffset = AISLE_GAP;
      }
    }

    const rowWidth = (rowCols - 1) * colSpacing;

    for (let c = 0; c < rowCols; c++) {
      const lx = (c * colSpacing) - (rowWidth / 2);
      const ly = (r * rowSpacing) + yOffset;

      const tx = startX + (lx * Math.cos(rad) - ly * Math.sin(rad));
      const ty = startY + (lx * Math.sin(rad) + ly * Math.cos(rad));

      seats.push({
        id: `${sectionName}-r${r}-c${c}`,
        x: tx, y: ty, r: SEAT_RADIUS,
        section: sectionName,
        color,
        status: 'available',
        price,
        label: `${type} - Row ${r + 1} Seat ${c + 1}`
      });
    }
  }
  return seats;
};


// Curved Section Helper
const createArcSection = (
  sectionName: string,
  centerX: number,
  centerY: number,
  startRadius: number,
  startAngle: number,
  endAngle: number,
  rows: number,
  overrideType?: 'VIP' | 'Premium' | 'General'
): Seat[] => {
  const seats: Seat[] = [];

  for (let r = 0; r < rows; r++) {
    let radiusOffset = 0;

    let color = COLORS.General;
    let type = 'General';
    let price = PRICES.General;

    if (overrideType) {
      type = overrideType;
      color = COLORS[overrideType];
      price = PRICES[overrideType];
    } else {
      if (r < 3) {
        color = COLORS.VIP; type = 'VIP'; price = PRICES.VIP;
      } else if (r < 7) {
        color = COLORS.Premium; type = 'Premium'; price = PRICES.Premium;
      } else {
        // General
        radiusOffset = AISLE_GAP;
      }
    }

    const currentRadius = startRadius + (r * SPACING_Y) + radiusOffset;

    const circumference = 2 * Math.PI * currentRadius;
    const angPerUnit = 360 / circumference;
    const angStep = SPACING_X * angPerUnit;

    const availableAng = Math.abs(endAngle - startAngle);
    const colCount = Math.floor(availableAng / angStep);

    const usedAng = (colCount - 1) * angStep;
    const offset = (availableAng - usedAng) / 2;

    const dir = startAngle < endAngle ? 1 : -1;

    for (let c = 0; c < colCount; c++) {
      const angDeg = startAngle + (dir * (offset + c * angStep));
      const rad = (angDeg * Math.PI) / 180;

      const tx = centerX + currentRadius * Math.cos(rad);
      const ty = centerY + currentRadius * Math.sin(rad);

      seats.push({
        id: `${sectionName}-r${r}-c${c}`,
        x: tx, y: ty, r: SEAT_RADIUS,
        section: sectionName,
        color,
        status: 'available',
        price,
        label: `${type} - Row ${r + 1} Seat ${c + 1}`
      });
    }
  }
  return seats;
}

// Tapered Arc Helper
const createTaperedArcSection = (
  sectionName: string,
  centerX: number,
  centerY: number,
  startRadius: number,
  baseStartAngle: number, // Target start angle - Where OUTER rows start
  baseEndAngle: number,   // Target end angle - Where ALL rows end
  rows: number,
  invertTaper: boolean = false // If true, cuts the START. If false, cuts the END.
): Seat[] => {
  const seats: Seat[] = [];

  for (let r = 0; r < rows; r++) {
    let radiusOffset = 0;
    let color = COLORS.General;
    let type = 'General';
    let price = PRICES.General;

    if (r < 3) {
      color = COLORS.VIP; type = 'VIP'; price = PRICES.VIP;
    } else if (r < 7) {
      color = COLORS.Premium; type = 'Premium'; price = PRICES.Premium;
    } else {
      // General
      radiusOffset = AISLE_GAP;
    }

    // Taper Logic
    // We want Outer (High Index) to be FULL span.
    // Inner (Low Index) to be REDUCED span.

    // Max cut for Row 0 (Inner)
    const maxCut = 60; // Dramatic cut for staircase effect

    // Linear interpolation: cut = maxCut * (1 - r/(rows-1))
    // So row 11 has 0 cut (full span). Row 0 has maxCut.
    const cut = Math.max(0, maxCut * (1 - (r / (rows - 0.5))));

    let currentStart = baseStartAngle;
    let currentEnd = baseEndAngle;

    if (invertTaper) {
      // Cut the START angle. Start moves closer to End.
      if (baseStartAngle > baseEndAngle) {
        // e.g. 160 -> 100. Cut reduces Start.
        currentStart = baseStartAngle - cut;
      } else {
        // e.g. 20 -> 80. Cut increases Start.
        currentStart = baseStartAngle + cut;
      }
    } else {
      // Cut the END angle. End moves closer to Start.
      if (baseStartAngle > baseEndAngle) {
        currentEnd = baseEndAngle + cut;
      } else {
        currentEnd = baseEndAngle - cut;
      }
    }

    const currentRadius = startRadius + (r * SPACING_Y) + radiusOffset;
    const circumference = 2 * Math.PI * currentRadius;
    const angPerUnit = 360 / circumference;
    const angStep = SPACING_X * angPerUnit;

    const availableAng = Math.abs(currentEnd - currentStart);
    const colCount = Math.floor(availableAng / angStep);

    // Direction logic
    const dir = baseStartAngle < baseEndAngle ? 1 : -1;

    for (let c = 0; c < colCount; c++) {
      // Start from the ADJUSTED start angle
      // Note: If dir is positive (20->80), we add step. If negative (160->100), we subtract step.
      // But if we CUT the start (e.g. start is now 70 instead of 20), we start from 70.
      const angDeg = currentStart + (dir * (c * angStep));
      const rad = (angDeg * Math.PI) / 180;

      const tx = centerX + currentRadius * Math.cos(rad);
      const ty = centerY + currentRadius * Math.sin(rad);

      seats.push({
        id: `${sectionName}-r${r}-c${c}`,
        x: tx, y: ty, r: SEAT_RADIUS,
        section: sectionName,
        color,
        status: 'available',
        price,
        label: `${type} - Row ${r + 1} Seat ${c + 1}`
      });
    }
  }
  return seats;
}


export function SeatingChart({ onSectionSelect, selectedSection, onCheckout }: {
  onSectionSelect: (section: string | null) => void;
  selectedSection: string | null;
  onCheckout?: (seats: Seat[]) => void;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // --- Layout Definition ---
  // Taller Stage
  const STAGE_X = 500;
  const STAGE_Y = 325;
  const STAGE_W = 350;
  const STAGE_H = 550;

  const allSeats: Seat[] = [
    // --- LEFT SIDE (Straight & Long) ---
    // Moving Down slightly to match user request "baja un poco".
    // Was 150 -> Now 180

    // Top Left
    ...createSection('Left Top', 300, 180, 12, [28], SPACING_Y, SPACING_X, 90),
    // Bot Left
    // Was 400 -> Now 430
    ...createSection('Left Bot', 300, 430, 12, [28], SPACING_Y, SPACING_X, 90),

    // --- RIGHT SIDE (Straight & Long) ---
    // Top Right
    // Was 150 -> Now 180
    ...createSection('Right Top', 700, 180, 12, [28], SPACING_Y, SPACING_X, -90),
    // Bot Right
    // Was 400 -> Now 430
    ...createSection('Right Bot', 700, 430, 12, [28], SPACING_Y, SPACING_X, -90),

    // --- BOTTOM SIDE ---
    // Gap Fillers (Split VIP/Premium per user diagram)
    // Left Side: Outer=Premium(Red), Inner=VIP(Yellow)
    // Aligning accurately: Left Vertical VIP X~292, Prem X~264.
    // X=262 and X=292 align with the centers of the vertical strips above.
    ...createSection('Gap Left Outer', 262, 550, 4, [4], SPACING_Y, SPACING_X, 0, 'Premium'),
    ...createSection('Gap Left Inner', 292, 550, 4, [3], SPACING_Y, SPACING_X, 0, 'VIP'),

    // Right Side: Inner=VIP(Yellow), Outer=Premium(Red)
    // Aligning accurately: Right Vertical VIP X~708, Prem X~736.
    ...createSection('Gap Right Inner', 708, 550, 4, [3], SPACING_Y, SPACING_X, 0, 'VIP'),
    ...createSection('Gap Right Outer', 738, 550, 4, [4], SPACING_Y, SPACING_X, 0, 'Premium'),

    // Bottom Left Corner (Curved & Tapered)
    // Center logic applied: Outer R=270 meets Side Outer X=200 at Y=542 approx. Center=(460, 470).
    // Start 165 (Top), End 100 (Bottom).
    // InvertTaper = true -> Taper the Start (165).
    ...createTaperedArcSection('Corner Left', 460, 470, 170, 165, 100, 12, true),

    // Bottom Center (Straight)
    // Y=640. Outer edge Y=740. Matches Corner Bottom Y (470+270=740). Perfect.
    ...createSection('Bottom Center', 500, 640, 12, [18], SPACING_Y, SPACING_X, 0),

    // Bottom Right Corner (Curved & Tapered)
    // Center (540, 470). Start 15 (Top), End 80 (Bottom).
    // InvertTaper = true -> Taper the Start (15).
    ...createTaperedArcSection('Corner Right', 540, 470, 170, 15, 80, 12, true),
  ];

  // --- Zoom Logic ---
  const getRelatedSections = (section: string | null): string[] => {
    if (!section) return [];
    const leftGroup = ['Corner Left', 'Gap Left Outer', 'Gap Left Inner'];
    if (leftGroup.includes(section)) return leftGroup;

    const rightGroup = ['Corner Right', 'Gap Right Inner', 'Gap Right Outer'];
    if (rightGroup.includes(section)) return rightGroup;

    return [section];
  };

  React.useEffect(() => {
    if (selectedSection) {
      // Find bounds of the section (including related gap fillers)
      const related = getRelatedSections(selectedSection);
      const sectionSeats = allSeats.filter(s => related.includes(s.section));

      if (sectionSeats.length === 0) return;

      const minX = Math.min(...sectionSeats.map(s => s.x));
      const maxX = Math.max(...sectionSeats.map(s => s.x));
      const minY = Math.min(...sectionSeats.map(s => s.y));
      const maxY = Math.max(...sectionSeats.map(s => s.y));

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      // Target zoom level
      const targetScale = 2.5;

      // Calculate translation to center the target point (cx, cy)
      // Viewport Center is (500, 425) relative to the 1000x850 viewBox
      // Formula: Translate = Center - (Point * Scale)
      const newX = 500 - (cx * targetScale);
      const newY = 425 - (cy * targetScale);

      setScale(targetScale);
      setPosition({ x: newX, y: newY });

    } else {
      // Reset
    }
  }, [selectedSection]);


  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onSectionSelect(null);
  };

  const handleSeatClick = (e: React.MouseEvent, seat: Seat) => {
    e.stopPropagation();

    if (selectedSection !== seat.section) {
      // Check if we are already in the "group" but clicking a different part?
      // Actually, if we click a Gap seat while Corner is selected, we usually want to just select the seat, NOT re-zoom or reset.
      // But currently seat.section != selectedSection.
      // Enhancment: If seat.section is in getRelatedSections(selectedSection), treat as same section.

      const related = getRelatedSections(selectedSection);
      if (related.includes(seat.section)) {
        // Same group, just toggle seat
        setSelectedSeats(prev => {
          if (prev.includes(seat.id)) {
            return prev.filter(id => id !== seat.id);
          } else {
            return [...prev, seat.id];
          }
        });
        return;
      }

      // Zoom into section
      onSectionSelect(seat.section);
    } else {
      // Toggle selection
      setSelectedSeats(prev => {
        if (prev.includes(seat.id)) {
          return prev.filter(id => id !== seat.id);
        } else {
          return [...prev, seat.id];
        }
      });
    }
  };

  // Logic for Family Pack
  const selectedCount = selectedSeats.length;
  // Calculate total price
  const rawTotal = selectedSeats.reduce((sum, id) => {
    const s = allSeats.find(seat => seat.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  const isFamilyPack = selectedCount >= 4;
  const discount = isFamilyPack ? rawTotal * 0.20 : 0;
  const finalPrice = rawTotal - discount;

  // Prop coords relative to center
  const PROP_Y = STAGE_Y - 40;
  const TEXT_Y = STAGE_Y + 40;

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Top Controls */}
      <div className="flex w-full justify-between items-center mb-4 px-4">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleReset}><RotateCcw className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
        </div>

        {selectedSection && (
          <Button variant="default" onClick={handleReset}>Back to Overview</Button>
        )}
      </div>

      <div
        className="border rounded-lg bg-white overflow-hidden w-full h-[600px] relative shadow-inner cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => { setIsDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }); }}
        onMouseMove={(e) => { if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 850"
        >
          <g
            transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
            className="transition-transform duration-500 ease-in-out"
          >
            {/* Stage Background Area */}
            <rect x={STAGE_X - STAGE_W / 2} y={STAGE_Y - STAGE_H / 2} width={STAGE_W} height={STAGE_H} fill={COLORS.Stage} ry="4" opacity={0.5} />

            {/* Prop/Details - Light Source Style */}
            <defs>
              <radialGradient id="stageLightGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx={STAGE_X} cy={PROP_Y + 20} rx="60" ry="20" fill="url(#stageLightGrad)" opacity="0.6" />

            {/* Trapezoid Shape */}
            <path d={`M${STAGE_X - 25},${PROP_Y - 30} L${STAGE_X + 25},${PROP_Y - 30} L${STAGE_X + 40},${PROP_Y + 30} L${STAGE_X - 40},${PROP_Y + 30} Z`} fill="#475569" />

            {/* Stage Text */}
            <text x={STAGE_X} y={TEXT_Y} textAnchor="middle" className="text-4xl font-extrabold fill-slate-500 uppercase tracking-[0.2em] opacity-80" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>Stage</text>

            {/* Render Seats */}
            {allSeats.map((seat) => {
              // Determine visual state
              const isSelected = selectedSeats.includes(seat.id);

              // Group Logic for Active/Dim
              const activeGroup = selectedSection ? getRelatedSections(selectedSection) : [];
              // If no section selected, everything is active (true).
              // If section selected, seat is active if in the group.
              const isSectionActive = !selectedSection || activeGroup.includes(seat.section);

              // If we are zoomed in (selectedSection is not null), dim others
              // If we are zoomed out, all are fully visible (opacity 1)
              let opacity = 1;
              if (selectedSection && !isSectionActive) {
                opacity = 0.1; // Dim non-selected sections
              }

              // Color override for selection
              let fill = seat.color;
              if (isSelected) fill = "#22c55e"; // Green for selected
              // if occupied... (future)

              return (
                <circle
                  key={seat.id}
                  cx={seat.x}
                  cy={seat.y}
                  r={seat.r}
                  fill={fill}
                  opacity={opacity}
                  className={cn(
                    "transition-all duration-200 cursor-pointer hover:r-[6px]",
                    isSelected ? "stroke-black stroke-2 r-[5px]" : ""
                  )}
                  onClick={(e) => handleSeatClick(e, seat)}
                >
                  <title>{seat.label} (${seat.price})</title>
                </circle>
              );
            })}

            {/* Towers / Exits */}
            <rect x={150} y={750} width="40" height="20" fill="#bef264" rx="2" />
            <text x={170} y={763} textAnchor="middle" className="text-[10px] font-bold fill-green-900 pointer-events-none">EXIT</text>

            <rect x={810} y={750} width="40" height="20" fill="#bef264" rx="2" />
            <text x={830} y={763} textAnchor="middle" className="text-[10px] font-bold fill-green-900 pointer-events-none">EXIT</text>
          </g>
        </svg>

        {/* Floating Info Panel */}
        {selectedCount > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl border border-slate-200 w-64">
            <h3 className="font-bold text-lg mb-2">Your Selection</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Seats:</span>
              <span className="font-medium">{selectedCount}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Subtotal:</span>
              <span>${rawTotal}</span>
            </div>
            {isFamilyPack && (
              <div className="flex justify-between text-sm text-green-600 font-bold mb-1">
                <span>Family Pack (20%):</span>
                <span>-${discount.toFixed(0)}</span>
              </div>
            )}
            <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${finalPrice.toFixed(0)}</span>
            </div>
            <Button
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              onClick={() => {
                if (onCheckout) {
                  const seats = allSeats.filter(s => selectedSeats.includes(s.id));
                  onCheckout(seats);
                }
              }}
            >
              Checkout Now
            </Button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm font-medium text-slate-600">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.VIP }}></div> VIP ($150)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.Premium }}></div> Premium ($95)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.General }}></div> General ($60)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Selected</div>
      </div>
    </div>
  );
}
