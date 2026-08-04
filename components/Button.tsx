import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // Ghost Button Premium Style
  // Base: No border (transparent), No background, Black Text (brand-white is #000).
  // Padding: Spacious (py-5 = 20px, px-9 = 36px)
  // Text: Uppercase, spacing 1px, medium font.
  
  const baseStyles = "py-5 px-9 text-sm font-medium uppercase tracking-[1px] transition-all duration-200 ease-out border border-transparent bg-transparent cursor-pointer relative";
  const widthStyles = fullWidth ? "w-full flex justify-center" : "inline-block";
  const focusStyles = "focus:outline-none focus:border-dashed focus:border-brand-white/20";
  
  // Hover: Border appears (1px solid), Text underlines.
  // Using brand-white (Black) for the default theme.
  // The opacity on the border (e.g. /25) creates the "softer look" requested.
  const hoverStyles = "hover:border-brand-white/40 hover:underline decoration-1 underline-offset-4";

  // Note: All variants now converge to this single premium look, 
  // but we keep the prop for compatibility and potential minor tweaks if needed later.
  
  return (
    <button 
      className={`${baseStyles} ${widthStyles} ${focusStyles} ${hoverStyles} text-brand-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};