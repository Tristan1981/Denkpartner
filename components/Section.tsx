import React from 'react';

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  darker?: boolean;
}

export const Section: React.FC<SectionProps> = ({ id, className = "", children, darker = false }) => {
  return (
    <section 
      id={id} 
      className={`py-12 md:py-14 px-6 md:px-12 lg:px-24 w-full relative overflow-hidden bg-brand-black ${className}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </section>
  );
};