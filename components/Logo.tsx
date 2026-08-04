import React from 'react';

interface LogoProps {
  className?: string;
  scrolled?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", scrolled = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center font-bold tracking-widest text-brand-white`}>
      {/* 
        Using the image path as requested. 
        Removed 'invert' because the background is now white, so we want the dark/original logo.
      */}
      <img 
        src="/images/logo-tristan-wiering.png" 
        alt="Tristan Wiering Logo" 
        className={`${className} object-contain grayscale`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <div className="hidden flex flex-col items-center">
        <div className="border-2 border-brand-white/80 rounded-full w-10 h-10 flex items-center justify-center mb-1">
          <span className="text-sm">TW</span>
        </div>
        <span className="text-[0.6rem] uppercase tracking-[0.2em]">Tristan Wiering</span>
      </div>
    </div>
  );
};