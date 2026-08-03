import React from "react";

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor = "#D0D5DD" }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-2">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full max-h-[220px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* World Map Continent Outlines */}
        <g fill={mapColor} className="transition-colors hover:opacity-90">
          {/* North America */}
          <path d="M120,60 C180,40 260,50 320,90 C340,140 290,190 220,210 C160,220 110,160 120,60 Z" />
          {/* South America */}
          <path d="M260,230 C320,240 350,310 320,400 C270,430 230,370 250,280 Z" />
          {/* Europe */}
          <path d="M460,70 C540,60 580,90 550,140 C490,150 450,120 460,70 Z" />
          {/* Africa */}
          <path d="M460,160 C560,160 580,250 540,350 C470,360 440,280 460,160 Z" />
          {/* Asia */}
          <path d="M570,60 C750,40 900,100 850,220 C730,240 600,190 570,60 Z" />
          {/* Australia */}
          <path d="M770,290 C860,280 890,340 840,390 C760,400 740,340 770,290 Z" />
        </g>

        {/* USA Marker */}
        <g className="cursor-pointer">
          <circle cx="210" cy="130" r="10" className="fill-brand-500/30 animate-pulse" />
          <circle cx="210" cy="130" r="5" className="fill-brand-500 stroke-white stroke-2" />
          <title>United States</title>
        </g>

        {/* Europe / France Marker */}
        <g className="cursor-pointer">
          <circle cx="490" cy="105" r="10" className="fill-brand-500/30 animate-pulse" />
          <circle cx="490" cy="105" r="5" className="fill-brand-500 stroke-white stroke-2" />
          <title>France</title>
        </g>

        {/* India Marker */}
        <g className="cursor-pointer">
          <circle cx="680" cy="165" r="10" className="fill-brand-500/30 animate-pulse" />
          <circle cx="680" cy="165" r="5" className="fill-brand-500 stroke-white stroke-2" />
          <title>India</title>
        </g>

        {/* Sweden / UK Marker */}
        <g className="cursor-pointer">
          <circle cx="510" cy="75" r="10" className="fill-brand-500/30 animate-pulse" />
          <circle cx="510" cy="75" r="5" className="fill-brand-500 stroke-white stroke-2" />
          <title>Sweden</title>
        </g>
      </svg>
    </div>
  );
};

export default CountryMap;
