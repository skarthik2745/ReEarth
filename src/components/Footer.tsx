import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  
  // Hide footer on chatbot page
  if (location.pathname === '/chatbot') {
    return null;
  }

  return (
    <footer className="bg-black border-t-4 border-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="retro-text retro-text-cyan mb-4">
            <span className="blink">_</span> ReEarth ARCADE <span className="blink">_</span>
          </div>
          <div className="retro-text text-xs retro-text-yellow mb-2">
            SAVE THE PLANET • LEVEL UP • EARN BADGES
          </div>
          <div className="retro-text text-xs retro-text-magenta">
            © 2024 ReEarth SYSTEMS • ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}