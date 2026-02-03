import { cn } from "@/lib/utils";

export const GardenBrosLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className)}>
      <span className="sr-only">Garden Bros Circus</span>
      <svg viewBox="0 0 380 90" className="h-12 w-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="circus-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>
        <g style={{ filter: "url(#circus-shadow)" }}>
          <text 
            x="50%" 
            y="35%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            fontSize="38" 
            fill="#e53935"
            stroke="#b71c1c"
            strokeWidth="0.5"
            letterSpacing="2"
          >
            GARDEN BROS
          </text>
          <text 
            x="50%" 
            y="78%" 
            dominantBaseline="middle" 
            textAnchor="middle" 
            style={{ fontFamily: "'Anton', sans-serif" }}
            fontSize="58" 
            fill="#fbc02d" 
            stroke="#f57f17"
            strokeWidth="1.5"
            letterSpacing="1"
          >
            CIRCUS
          </text>
        </g>
      </svg>
    </div>
  );
};
