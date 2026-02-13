'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SeatService } from '@/services/seat-service';

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
  | 'General Bottom'
  | 'Gap Left Outer'
  | 'Gap Left Inner'
  | 'Gap Right Inner'
  | 'Gap Right Outer'
  | 'Corner Left'
  | 'Bottom Center'
  | 'Corner Right'
  | 'Left Top'
  | 'Left Bot'
  | 'Right Top'
  | 'Right Bot';

export type TicketType = 'Adult' | 'Child' | 'Promo';

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
  ticketType?: TicketType;
}

interface Label {
  text: string;
  x: number;
  y: number;
  rotation: number;
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

// Pricing Configuration (Updated from Screenshots)
const PRICING_TIERS = {
  // VIP: Adult $68.07, Child $47.48. Promo captures the "Family Pack" avg ($146.64/4 = $36.66)
  VIP: { Adult: 68.07, Child: 47.48, Promo: 36.66 },
  // Premium: Adult $57.78, Child $37.17. NO PROMO.
  Premium: { Adult: 57.78, Child: 37.17, Promo: null },
  // General: Adult $47.48, Child $26.88, Promo $23.27
  General: { Adult: 47.48, Child: 26.88, Promo: 23.27 }
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
  overrideType?: 'VIP' | 'Premium' | 'General',
  startRowChar: string = 'A'
): { seats: Seat[]; labels: Label[] } => {
  const seats: Seat[] = [];
  const labels: Label[] = [];
  const rad = (rotation * Math.PI) / 180;

  for (let r = 0; r < rows; r++) {
    const rowCols = cols[r] || cols[0];

    // Determine Category
    let color = COLORS.General;
    let type: 'VIP' | 'Premium' | 'General' = 'General';
    let yOffset = 0;

    if (overrideType) {
      type = overrideType;
      color = COLORS[overrideType];
    } else {
      if (r < 2) { // VIP is now 2 rows (A, B)
        color = COLORS.VIP;
        type = 'VIP';
      } else if (r < 6) { // Premium is next 4 rows (C, D, E, F)
        color = COLORS.Premium;
        type = 'Premium';
      } else {
        // GENERAL (Blue)
        yOffset = AISLE_GAP;
      }
    }

    const price = PRICING_TIERS[type].Adult; // Default price for base render

    const rowWidth = (rowCols - 1) * colSpacing;
    const rowLabel = String.fromCharCode(startRowChar.charCodeAt(0) + r);

    // Row Label Position (Left of row)
    const lx_label = - (rowWidth / 2) - 12;
    const ly_label = (r * rowSpacing) + yOffset;
    const tx_label = startX + (lx_label * Math.cos(rad) - ly_label * Math.sin(rad));
    const ty_label = startY + (lx_label * Math.sin(rad) + ly_label * Math.cos(rad));

    labels.push({
      text: rowLabel,
      x: tx_label,
      y: ty_label,
      rotation: rotation
    });

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
        label: `${type} - Row ${rowLabel} Seat ${c + 1}`,
      });
    }
  }
  return { seats, labels };
};

const createTaperedArcSection = (
  sectionName: string,
  centerX: number,
  centerY: number,
  startRadius: number,
  baseStartAngle: number,
  baseEndAngle: number,
  rows: number,
  invertTaper: boolean = false,
  startRowChar: string = 'A'
): { seats: Seat[]; labels: Label[] } => {
  const seats: Seat[] = [];
  const labels: Label[] = [];

  for (let r = 0; r < rows; r++) {
    let radiusOffset = 0;
    let color = COLORS.General;
    let type: 'VIP' | 'Premium' | 'General' = 'General';

    if (r < 2) {
      color = COLORS.VIP; type = 'VIP';
    } else if (r < 6) {
      color = COLORS.Premium; type = 'Premium';
    } else {
      radiusOffset = AISLE_GAP;
    }

    // Default Price
    const price = PRICING_TIERS[type].Adult;

    const maxCut = 60;
    const cut = Math.max(0, maxCut * (1 - (r / (rows - 0.5))));

    let currentStart = baseStartAngle;
    let currentEnd = baseEndAngle;

    if (invertTaper) {
      if (baseStartAngle > baseEndAngle) {
        currentStart = baseStartAngle - cut;
      } else {
        currentStart = baseStartAngle + cut;
      }
    } else {
      if (baseStartAngle > baseEndAngle) {
        currentEnd = baseEndAngle + cut;
      } else {
        currentEnd = baseEndAngle - cut;
      }
    }

    const currentRadius = startRadius + (r * SPACING_Y) + radiusOffset;
    const angStep = SPACING_X * (360 / (2 * Math.PI * currentRadius));
    const availableAng = Math.abs(currentEnd - currentStart);
    const colCount = Math.floor(availableAng / angStep);
    const dir = baseStartAngle < baseEndAngle ? 1 : -1;

    // Row Label
    const labelAng = currentStart - (dir * (angStep * 2));
    const labelRad = (labelAng * Math.PI) / 180;
    const lx = centerX + currentRadius * Math.cos(labelRad);
    const ly = centerY + currentRadius * Math.sin(labelRad);
    const rowLabel = String.fromCharCode(startRowChar.charCodeAt(0) + r);

    labels.push({
      text: rowLabel,
      x: lx,
      y: ly,
      rotation: 0
    });


    for (let c = 0; c < colCount; c++) {
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
        label: `${type} - Row ${rowLabel} Seat ${c + 1}`,
      });
    }
  }
  return { seats, labels };
}


// ... (Existing Helpers)

// Helper to generate Rectangular Boundary Path
const createRectBoundary = (
  sectionName: string,
  startX: number,
  startY: number,
  rows: number,
  cols: number[],
  rowSpacing: number,
  colSpacing: number,
  rotation: number
) => {
  // Approximate width/height
  const maxCols = Math.max(...cols);
  const width = maxCols * colSpacing;
  const height = rows * rowSpacing + 20; // + padding

  // Local rectangle corners relative to startX, startY
  const corners = [
    { x: -width / 2 - 20, y: -10 },
    { x: width / 2 + 20, y: -10 },
    { x: width / 2 + 20, y: height + 10 },
    { x: -width / 2 - 20, y: height + 10 }
  ];

  const rad = (rotation * Math.PI) / 180;

  // Rotate and Translate
  const points = corners.map(p => {
    const rx = p.x * Math.cos(rad) - p.y * Math.sin(rad);
    const ry = p.x * Math.sin(rad) + p.y * Math.cos(rad);
    return `${startX + rx},${startY + ry}`;
  });

  return {
    id: sectionName,
    path: `M ${points.join(' L ')} Z`,
    center: { x: startX, y: startY + height / 2 }
  };
};

const createArcBoundary = (
  sectionName: string,
  centerX: number,
  centerY: number,
  startRadius: number,
  rows: number,
  baseStartAngle: number,
  baseEndAngle: number,
  rowSpacing: number
) => {
  const innerR = startRadius - 20;
  const outerR = startRadius + (rows * rowSpacing) + 20;

  // Convert to radians
  const startRad = (baseStartAngle * Math.PI) / 180;
  const endRad = (baseEndAngle * Math.PI) / 180;

  // Check direction
  const largeArc = Math.abs(baseEndAngle - baseStartAngle) > 180 ? 1 : 0;
  const sweep = baseEndAngle > baseStartAngle ? 1 : 0;

  // Points
  const p1 = { x: centerX + innerR * Math.cos(startRad), y: centerY + innerR * Math.sin(startRad) };
  const p2 = { x: centerX + outerR * Math.cos(startRad), y: centerY + outerR * Math.sin(startRad) };
  const p3 = { x: centerX + outerR * Math.cos(endRad), y: centerY + outerR * Math.sin(endRad) };
  const p4 = { x: centerX + innerR * Math.cos(endRad), y: centerY + innerR * Math.sin(endRad) };

  const path = [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} ${sweep} ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} ${1 - sweep} ${p1.x} ${p1.y}`,
    `Z`
  ].join(' ');

  return {
    id: sectionName,
    path,
    center: { x: centerX, y: centerY + (innerR + outerR) / 2 } // Approx
  };
};

export function SeatingChart({ showId, onSectionSelect, selectedSection, onCheckout, title }: {
  showId: string;
  onSectionSelect: (section: string | null) => void;
  selectedSection: string | null;
  onCheckout?: (seats: Seat[]) => void;
  title?: string;
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Simplified selection: Just ID and Base Price
  const [selectedSeats, setSelectedSeats] = useState<{ id: string; price: number; section: string; label: string }[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null); // Track hover

  // Fetch occupied seats on mount
  React.useEffect(() => {
    const fetchOccupied = async () => {
      if (!showId) return;
      const occupied = await SeatService.getReservedSeats(showId);
      setOccupiedSeats(occupied);
    };
    fetchOccupied();
  }, [showId]);

  // --- Layout Definition ---
  const { allSeats, allLabels, allBoundaries } = React.useMemo(() => {
    let seats: Seat[] = [];
    let labels: Label[] = [];
    let boundaries: { id: string, path: string }[] = [];

    const add = (result: { seats: Seat[], labels: Label[] }, boundary?: { id: string, path: string }) => {
      seats.push(...result.seats);
      labels.push(...result.labels);
      if (boundary) boundaries.push(boundary);
    };

    // Left Sections
    add(createSection('Left Top', 300, 180, 12, [28], SPACING_Y, SPACING_X, 90),
      createRectBoundary('Left Top', 300, 180, 12, [28], SPACING_Y, SPACING_X, 90));
    add(createSection('Left Bot', 300, 430, 12, [28], SPACING_Y, SPACING_X, 90),
      createRectBoundary('Left Bot', 300, 430, 12, [28], SPACING_Y, SPACING_X, 90));

    // Right Sections
    add(createSection('Right Top', 700, 180, 12, [28], SPACING_Y, SPACING_X, -90),
      createRectBoundary('Right Top', 700, 180, 12, [28], SPACING_Y, SPACING_X, -90));
    add(createSection('Right Bot', 700, 430, 12, [28], SPACING_Y, SPACING_X, -90),
      createRectBoundary('Right Bot', 700, 430, 12, [28], SPACING_Y, SPACING_X, -90));

    // Gap Fillers (Small Rects)
    add(createSection('Gap Left Outer', 262, 550, 4, [4], SPACING_Y, SPACING_X, 0, 'Premium', 'A'),
      createRectBoundary('Gap Left Outer', 262, 550, 4, [4], SPACING_Y, SPACING_X, 0));
    add(createSection('Gap Left Inner', 292, 550, 4, [3], SPACING_Y, SPACING_X, 0, 'VIP', 'E'),
      createRectBoundary('Gap Left Inner', 292, 550, 4, [3], SPACING_Y, SPACING_X, 0));

    add(createSection('Gap Right Inner', 708, 550, 4, [3], SPACING_Y, SPACING_X, 0, 'VIP', 'E'),
      createRectBoundary('Gap Right Inner', 708, 550, 4, [3], SPACING_Y, SPACING_X, 0));
    add(createSection('Gap Right Outer', 738, 550, 4, [4], SPACING_Y, SPACING_X, 0, 'Premium', 'A'),
      createRectBoundary('Gap Right Outer', 738, 550, 4, [4], SPACING_Y, SPACING_X, 0));

    // Corners (Arcs)
    add(createTaperedArcSection('Corner Left', 460, 470, 170, 165, 100, 12, true),
      createArcBoundary('Corner Left', 460, 470, 170, 12, 165, 100, SPACING_Y));

    add(createSection('Bottom Center', 500, 640, 12, [18], SPACING_Y, SPACING_X, 0),
      createRectBoundary('Bottom Center', 500, 640, 12, [18], SPACING_Y, SPACING_X, 0));

    add(createTaperedArcSection('Corner Right', 540, 470, 170, 15, 80, 12, true),
      createArcBoundary('Corner Right', 540, 470, 170, 12, 15, 80, SPACING_Y));

    return { allSeats: seats, allLabels: labels, allBoundaries: boundaries };
  }, []);

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
      const related = getRelatedSections(selectedSection);
      const sectionSeats = allSeats.filter(s => related.includes(s.section));

      if (sectionSeats.length === 0) return;

      const minX = Math.min(...sectionSeats.map(s => s.x));
      const maxX = Math.max(...sectionSeats.map(s => s.x));
      const minY = Math.min(...sectionSeats.map(s => s.y));
      const maxY = Math.max(...sectionSeats.map(s => s.y));

      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      const targetScale = 2.5;
      const newX = 500 - (cx * targetScale);
      const newY = 425 - (cy * targetScale);

      setScale(targetScale);
      setPosition({ x: newX, y: newY });

    } else {
      // Reset
    }
  }, [selectedSection, allSeats]);


  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 5));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    onSectionSelect(null);
  };

  const handleSeatClick = (e: React.MouseEvent, seat: Seat) => {
    e.stopPropagation();

    // Only allow clicking if section is selected
    if (!selectedSection) return;

    if (occupiedSeats.includes(seat.id)) {
      return;
    }

    if (selectedSection !== seat.section) {
      // Should default to selecting the section if different, but UI blocks this via overlay
      onSectionSelect(seat.section);
    } else {
      // Toggle
      setSelectedSeats(prev => {
        const existing = prev.find(s => s.id === seat.id);
        if (existing) {
          return prev.filter(s => s.id !== seat.id);
        } else {
          return [...prev, { id: seat.id, price: seat.price, section: seat.section, label: seat.label }];
        }
      });
    }
  };

  const selectedCount = selectedSeats.length;

  const getCheckoutSeats = () => {
    return selectedSeats.map(sel => {
      const original = allSeats.find(s => s.id === sel.id);
      if (!original) return null;
      return {
        ...original,
        price: sel.price
      };
    }).filter(Boolean) as Seat[];
  };

  const STAGE_X = 500;
  const STAGE_Y = 325;
  const STAGE_W = 350;
  const STAGE_H = 550;
  const PROP_Y = STAGE_Y - 40;
  const TEXT_Y = STAGE_Y + 40;

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Title & Controls */}
      <div className="flex w-full justify-between items-center mb-4 px-1 flex-wrap gap-2">
        <h3 className="font-headline text-xl font-bold text-left">{title}</h3>

        <div className="flex gap-2 items-center">
          {selectedSection && (
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white font-bold shadow-lg transition-all h-9 px-4 text-sm"
            >
              Back to Overview
            </Button>
          )}

          <div className="flex gap-1 border rounded-md shadow-sm bg-white">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none border-r hover:bg-slate-100" onClick={handleZoomOut}><ZoomOut className="h-4 w-4 text-slate-600" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none border-r hover:bg-slate-100" onClick={handleReset}><RotateCcw className="h-4 w-4 text-slate-600" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-slate-100" onClick={handleZoomIn}><ZoomIn className="h-4 w-4 text-slate-600" /></Button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg mb-4 text-sm font-medium border border-blue-100 shadow-sm animate-in fade-in w-full text-center">
        {selectedSection
          ? "Click available seats to select/deselect them."
          : "Select a Section on the map to view available seats."}
      </div>

      <div
        className="border rounded-lg bg-white overflow-hidden w-full h-[50rem] md:h-[600px] relative shadow-inner cursor-grab active:cursor-grabbing"
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

            <defs>
              <radialGradient id="stageLightGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx={STAGE_X} cy={PROP_Y + 20} rx="60" ry="20" fill="url(#stageLightGrad)" opacity="0.6" />
            <path d={`M${STAGE_X - 25},${PROP_Y - 30} L${STAGE_X + 25},${PROP_Y - 30} L${STAGE_X + 40},${PROP_Y + 30} L${STAGE_X - 40},${PROP_Y + 30} Z`} fill="#475569" />
            <text x={STAGE_X} y={TEXT_Y} textAnchor="middle" className="text-4xl font-extrabold fill-slate-500 uppercase tracking-[0.2em] opacity-80" style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.1)' }}>Stage</text>

            {/* Render Row Labels */}
            {allLabels.map((l, i) => (
              <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
                fill="#64748b" fontSize="4" fontWeight="bold"
                transform={`rotate(${l.rotation}, ${l.x}, ${l.y})`}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {l.text}
              </text>
            ))}

            {/* SEATS - Always rendered, but pointer-events managed */}
            <g className={!selectedSection ? "pointer-events-none opacity-50" : ""}>
              {allSeats.map((seat) => {
                const isSelected = selectedSeats.some(s => s.id === seat.id);
                const isOccupied = occupiedSeats.includes(seat.id);
                const activeGroup = selectedSection ? getRelatedSections(selectedSection) : [];
                const isSectionActive = !selectedSection || activeGroup.includes(seat.section);

                let opacity = 1;
                if (selectedSection && !isSectionActive) {
                  opacity = 0.1;
                }

                let fill = seat.color;
                if (isOccupied) fill = "#d1d5db";
                else if (isSelected) fill = "#22c55e";

                return (
                  <circle
                    key={seat.id}
                    cx={seat.x}
                    cy={seat.y}
                    r={seat.r}
                    fill={fill}
                    opacity={opacity}
                    className={cn(
                      "transition-all duration-200",
                      isOccupied ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:r-[6px]",
                      isSelected ? "stroke-black stroke-2 r-[5px]" : ""
                    )}
                    onClick={(e) => !isOccupied && handleSeatClick(e, seat)}
                  >
                  </circle>
                );
              })}
            </g>

            {/* SECTION OVERLAYS - Rendered only when NO section is selected */}
            {!selectedSection && allBoundaries.map((b) => (
              <path
                key={b.id}
                d={b.path}
                fill={hoveredSection === b.id ? "rgba(59, 130, 246, 0.2)" : "transparent"} // Blue highlight on hover
                stroke={hoveredSection === b.id ? "#2563eb" : "transparent"}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredSection(b.id)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionSelect(b.id);
                }}
              >
                <title>Click to Select {b.id}</title>
              </path>
            ))}


            {/* Towers / Exits */}
            <rect x={150} y={750} width="40" height="20" fill="#bef264" rx="2" />
            <text x={170} y={763} textAnchor="middle" className="text-[10px] font-bold fill-green-900 pointer-events-none">EXIT</text>
            <rect x={810} y={750} width="40" height="20" fill="#bef264" rx="2" />
            <text x={830} y={763} textAnchor="middle" className="text-[10px] font-bold fill-green-900 pointer-events-none">EXIT</text>
          </g>
        </svg>

      </div>

      {/* Floating Info Panel - Fixed Position */}
      {selectedCount > 0 && (
        // ...
        <div className="fixed bottom-8 right-8 z-[100] bg-white/95 backdrop-blur p-4 rounded-xl shadow-2xl border-2 border-slate-200 w-72 animate-in slide-in-from-bottom-4 zoom-in-95">
          <h3 className="font-bold text-lg mb-2">Your Selection</h3>
          <div className="flex justify-between text-sm mb-4">
            <span>Selected Seats:</span>
            <span className="font-bold text-lg">{selectedCount}</span>
          </div>

          {/* Incentive Message - Show when 3 seats selected */}
          {selectedCount === 3 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎉</span>
                <div className="flex-1">
                  <p className="font-bold text-amber-900 text-sm mb-1">
                    Almost there!
                  </p>
                  <p className="text-amber-800 text-xs leading-tight">
                    Select <strong>1 more seat</strong> and unlock group discounts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message - Show when 4+ seats selected */}
          {selectedCount >= 4 && (
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start gap-2">
                <span className="text-2xl">✨</span>
                <div className="flex-1">
                  <p className="font-bold text-green-900 text-sm mb-1">
                    Great! Family discount unlocked!
                  </p>
                  <p className="text-green-800 text-xs leading-tight">
                    You've qualified for special group pricing
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 hover:from-blue-800 hover:to-cyan-600 text-white shadow-lg py-6 text-lg tracking-wide rounded-lg font-bold"
            onClick={() => {
              if (onCheckout) {
                onCheckout(getCheckoutSeats());
              }
            }}
          >
            Continue ({selectedCount}) →
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm font-medium text-slate-600 flex-wrap justify-center">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.VIP }}></div> VIP</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.Premium }}></div> Premium</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: COLORS.General }}></div> General</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gray-300"></div> Occupied</div>
      </div>
    </div>
  );
}
