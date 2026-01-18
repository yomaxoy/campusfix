import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false
}) => {
  const hoverStyles = hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl shadow-md p-6 transition-all duration-200 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
