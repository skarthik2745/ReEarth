import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black starfield-bg">
      <div className="arcade-dialog p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-cyan-400`} />
          <p className="arcade-text arcade-text-yellow">{text.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );

}