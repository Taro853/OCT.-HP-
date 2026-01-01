import React from 'react';

export const MapSVG: React.FC = () => {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full bg-[#f0f4f8] rounded-xl overflow-hidden" xmlns="http://www.w3.org/2000/svg">
      {/* Background pattern */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#grid)" />
      
      {/* Train Line */}
      <path d="M -10 320 L 610 320" stroke="#fbbf24" strokeWidth="12" />
      <path d="M -10 320 L 610 320" stroke="#fff" strokeWidth="2" strokeDasharray="10,10" />
      <text x="50" y="300" className="text-xs fill-amber-500 font-bold">JR高平線</text>

      {/* Roads */}
      <path d="M 300 0 L 300 400" stroke="#cbd5e1" strokeWidth="20" />
      <path d="M 0 200 L 600 200" stroke="#cbd5e1" strokeWidth="16" />

      {/* Station */}
      <rect x="250" y="280" width="100" height="60" rx="4" fill="#1e293b" />
      <text x="300" y="315" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">高平駅</text>

      {/* Library Building */}
      <rect x="340" y="120" width="120" height="120" rx="8" fill="#0ea5e9" opacity="0.1" />
      <rect x="350" y="130" width="100" height="100" rx="4" fill="#0ea5e9" />
      <path d="M 350 130 L 450 130 L 450 140 L 350 140 Z" fill="#0284c7" />
      <text x="400" y="180" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">OCT</text>
      <text x="400" y="200" textAnchor="middle" fill="white" fontSize="10">おくざしき図書館</text>
      
      {/* Landmarks */}
      <circle cx="200" cy="150" r="15" fill="#a5f3fc" />
      <text x="200" y="180" textAnchor="middle" fill="#64748b" fontSize="10">郵便局</text>

      <circle cx="150" cy="250" r="15" fill="#dcfce7" />
      <text x="150" y="280" textAnchor="middle" fill="#64748b" fontSize="10">公園</text>

      {/* Route */}
      <path d="M 300 280 L 300 200 L 350 200 L 350 230" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="8,4" fill="none" />
      <circle cx="350" cy="230" r="6" fill="#ef4444" />
    </svg>
  );
};