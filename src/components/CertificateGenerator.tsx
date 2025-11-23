import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  lessonTitle: string;
  moduleTitle: string;
  completionDate: string;
  badgeIcon: string;
}

export default function Certificate({ studentName, lessonTitle, moduleTitle, completionDate, badgeIcon }: CertificateProps) {
  return (
    <div className="certificate p-8 max-w-2xl mx-auto relative">
      {/* Decorative Corner Stars */}
      <div className="absolute top-4 left-4">
        <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-4 right-4">
        <Star className="w-6 h-6 text-cyan-400 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-4">
        <Star className="w-6 h-6 text-magenta-400 animate-pulse" />
      </div>
      <div className="absolute bottom-4 right-4">
        <Star className="w-6 h-6 text-green-400 animate-pulse" />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="certificate-title text-2xl mb-4">
          ECO ARCADE ACHIEVEMENT
        </h1>
        <h2 className="certificate-title text-xl">
          CERTIFICATE OF COMPLETION
        </h2>
      </div>

      {/* Badge Icon */}
      <div className="text-center mb-6">
        <div className="inline-block text-6xl mb-4 animate-pulse">
          {badgeIcon}
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-8">
        <p className="arcade-text arcade-text-neon-yellow mb-4 text-sm">
          THIS CERTIFIES THAT
        </p>
        <h3 className="arcade-text arcade-text-neon-green text-xl mb-6" style={{textShadow: '2px 2px 0px #ff004d'}}>
          {studentName.toUpperCase()}
        </h3>
        <p className="arcade-text text-white mb-2 text-xs">
          HAS SUCCESSFULLY COMPLETED ALL REQUIREMENTS FOR
        </p>
        <h4 className="arcade-text arcade-text-neon-cyan mb-2 text-lg" style={{textShadow: '1px 1px 0px #ffcc00'}}>
          {lessonTitle.toUpperCase()}
        </h4>
        <p className="arcade-text arcade-text-neon-yellow text-xs mb-6">
          FROM MODULE: {moduleTitle.toUpperCase()}
        </p>
        <p className="arcade-text text-white text-xs mb-4">
          INCLUDING LESSON CONTENT, QUIZ MASTERY, AND ECO MISSION COMPLETION
        </p>
      </div>

      {/* Seal and Date */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <p className="arcade-text arcade-text-neon-yellow text-xs mb-2">
            COMPLETION DATE:
          </p>
          <p className="arcade-text text-white text-xs">
            {completionDate.toUpperCase()}
          </p>
        </div>
        
        <div className="certificate-seal">
          <Trophy className="text-white" size={24} />
        </div>
        
        <div className="text-right">
          <p className="arcade-text arcade-text-neon-yellow text-xs mb-2">
            ECOLEARN ARCADE
          </p>
          <p className="arcade-text text-white text-xs">
            CERTIFIED ACHIEVEMENT
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="arcade-text arcade-text-neon-green blink text-sm">
          LEVEL UP! MISSION COMPLETE!
        </p>
        <div className="flex justify-center space-x-2 mt-4">
          <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
          <Star className="w-4 h-4 text-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}} />
          <Star className="w-4 h-4 text-magenta-400 animate-pulse" style={{animationDelay: '0.4s'}} />
        </div>
      </div>
    </div>
  );
}

export function generateCertificate(studentName: string, lessonTitle: string, moduleTitle: string, badgeIcon: string = '🏆') {
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return {
    id: `cert_${Date.now()}`,
    studentName,
    lessonTitle,
    moduleTitle,
    completionDate,
    badgeIcon,
    issuedBy: 'EcoLearn Arcade System',
    certificateNumber: `ECO-${Date.now().toString().slice(-6)}`
  };
}