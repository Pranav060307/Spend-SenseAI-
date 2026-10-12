import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  style,
  ...props
}) => {
  const paddingStyles = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '24px',
  };

  return (
    <div
      className={`card-base ${className}`}
      style={{
        padding: paddingStyles[padding],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
