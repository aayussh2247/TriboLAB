import React from 'react';

interface GearProps {
  className?: string;
  size?: number;
}

export const HeaderGearArt: React.FC<GearProps> = ({ className = '', size = 72 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background sketch lines */}
      <path
        d="M 10 90 L 90 10 M 5 80 L 80 5 M 20 95 L 95 20"
        stroke="#FDBA74"
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      {/* Outer Gear */}
      <g className="animate-spin-slow" style={{ transformOrigin: '42px 48px' }}>
        <circle cx="42" cy="48" r="28" stroke="#1E293B" strokeWidth="2.5" fill="#FAF8F5" />
        <circle cx="42" cy="48" r="16" stroke="#F95721" strokeWidth="2" fill="none" strokeDasharray="4 2" />
        <circle cx="42" cy="48" r="7" fill="#1E293B" />
        {/* Teeth */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <rect
            key={deg}
            x="39.5"
            y="16"
            width="5"
            height="6"
            rx="1"
            fill="#1E293B"
            transform={`rotate(${deg} 42 48)`}
          />
        ))}
      </g>
      {/* Interlocking Small Gear */}
      <g className="animate-spin-reverse" style={{ transformOrigin: '72px 28px' }}>
        <circle cx="72" cy="28" r="16" stroke="#F95721" strokeWidth="2" fill="#FAF8F5" />
        <circle cx="72" cy="28" r="5" fill="#F95721" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="70.5"
            y="9"
            width="3"
            height="4"
            rx="0.5"
            fill="#F95721"
            transform={`rotate(${deg} 72 28)`}
          />
        ))}
      </g>
      {/* Third Tiny Gear */}
      <g className="animate-spin-slow" style={{ transformOrigin: '76px 68px' }}>
        <circle cx="76" cy="68" r="12" stroke="#475569" strokeWidth="1.8" fill="#FFFFFF" />
        <circle cx="76" cy="68" r="3.5" fill="#475569" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <rect
            key={deg}
            x="74.5"
            y="53.5"
            width="3"
            height="3.5"
            rx="0.5"
            fill="#475569"
            transform={`rotate(${deg} 76 68)`}
          />
        ))}
      </g>
    </svg>
  );
};

export const SidebarGearArt: React.FC<GearProps> = ({ className = '', size = 110 }) => {
  return (
    <div className={`relative flex items-center justify-center p-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sketch burst lines */}
        {[0, 35, 70, 105, 140, 175, 210, 245, 280, 315].map((angle, i) => (
          <line
            key={i}
            x1="60"
            y1="60"
            x2={60 + 55 * Math.cos((angle * Math.PI) / 180)}
            y2={60 + 55 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FED7AA"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        ))}
        {/* Big Gear */}
        <g className="animate-spin-slow" style={{ transformOrigin: '55px 65px' }}>
          <circle cx="55" cy="65" r="34" stroke="#1E293B" strokeWidth="2.5" fill="#FAF8F5" />
          <circle cx="55" cy="65" r="18" stroke="#F95721" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="55" cy="65" r="8" fill="#1E293B" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="52.5"
              y="26"
              width="5"
              height="7"
              rx="1.5"
              fill="#1E293B"
              transform={`rotate(${deg} 55 65)`}
            />
          ))}
        </g>
        {/* Small Gear */}
        <g className="animate-spin-reverse" style={{ transformOrigin: '92px 38px' }}>
          <circle cx="92" cy="38" r="18" stroke="#F95721" strokeWidth="2" fill="#FAF8F5" />
          <circle cx="92" cy="38" r="6" fill="#F95721" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="90.5"
              y="17"
              width="3.5"
              height="4.5"
              rx="1"
              fill="#F95721"
              transform={`rotate(${deg} 92 38)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
