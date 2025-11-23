import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { User, Trophy, Award, Download, Calendar, Star } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { userProgress } = useGame();

  const earnedBadges = userProgress.badges.filter(badge => badge.earned);
  const unearnedBadges = userProgress.badges.filter(badge => !badge.earned);

  // Teacher profile - show only basic details
  if (user?.role === 'teacher') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="retro-dialog p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-cyan-400 border-4 border-white flex items-center justify-center">
              <User className="w-12 h-12 text-black" />
            </div>
            <div className="flex-1">
              <h1 className="retro-h1 mb-4">{user?.name.toUpperCase()}</h1>
              <p className="retro-text retro-text-cyan mb-4">{user?.email.toUpperCase()}</p>
              <p className="retro-text retro-text-yellow text-xs mb-2">ROLE: TEACHER</p>
              <p className="retro-text retro-text-green text-xs">ADMIN CONTROL PANEL ACCESS</p>
            </div>
            <div className="text-right">
              <p className="retro-text retro-text-yellow text-xs mb-2">JOINED</p>
              <p className="retro-text retro-text-cyan text-xs">DEC 2024</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student profile - show full profile with achievements
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="retro-dialog p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-cyan-400 border-4 border-white flex items-center justify-center">
            <User className="w-12 h-12 text-black" />
          </div>
          <div className="flex-1">
            <h1 className="retro-h1 mb-4">ECO PASSPORT</h1>
            <h2 className="retro-h2 mb-4">{user?.name.toUpperCase()}</h2>
            <p className="retro-text retro-text-cyan mb-4">{user?.email.toUpperCase()}</p>
            <div className="flex items-center space-x-6 retro-text text-xs">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="retro-text-yellow">LV {userProgress.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="retro-text-green">{userProgress.points} PTS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-magenta-400" />
                <span className="retro-text-magenta">{earnedBadges.length} BADGES</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="retro-text retro-text-yellow text-xs mb-2">JOINED</p>
            <p className="retro-text retro-text-cyan text-xs">DEC 2024</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* My Achievements - Earned Badges */}
        <div className="retro-card retro-card-red p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="retro-h2">MY ACHIEVEMENTS</h2>
            <span className="retro-card bg-green-400 text-black retro-text text-xs px-3 py-1">
              {earnedBadges.length} EARNED
            </span>
          </div>
          
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="badge-card earned p-4">
                  <div className="text-center mb-3">
                    <span className="text-4xl mb-2 block">{badge.icon}</span>
                    <h3 className="arcade-text arcade-text-neon-cyan text-xs">{badge.name.toUpperCase()}</h3>
                  </div>
                  <p className="arcade-text arcade-text-neon-yellow text-xs text-center mb-2">{badge.description.toUpperCase()}</p>
                  <div className="flex items-center justify-center space-x-1 arcade-text arcade-text-neon-green text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{badge.earnedDate?.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <p className="arcade-text arcade-text-neon-yellow">NO BADGES EARNED YET</p>
              <p className="arcade-text arcade-text-neon-cyan text-xs mt-1">COMPLETE MISSIONS TO EARN BADGES!</p>
            </div>
          )}
        </div>

        {/* All Available Badges - Badge Shelf */}
        <div className="retro-card retro-card-magenta p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="retro-h2">BADGE SHELF</h2>
            <span className="retro-card bg-cyan-400 text-black retro-text text-xs px-3 py-1">
              {userProgress.badges.length} TOTAL
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {userProgress.badges.map((badge, index) => {
              const colors = ['arcade-card-cyan', 'arcade-card-magenta', 'arcade-card-green', 'arcade-card-yellow'];
              const textColors = ['arcade-text-neon-cyan', 'arcade-text-neon-pink', 'arcade-text-neon-green', 'arcade-text-neon-yellow'];
              const colorIndex = index % 4;
              
              return (
                <div key={badge.id} className={`${colors[colorIndex]} earned p-6 min-h-[220px] w-full flex flex-col justify-between`}>
                  <div className="text-center flex-1 flex flex-col justify-center">
                    <span className="text-5xl mb-4 block">{badge.icon}</span>
                    <h3 className={`arcade-text text-base ${textColors[colorIndex]} leading-tight mb-3 break-words`}>
                      {badge.name.toUpperCase()}
                    </h3>
                    <p className="arcade-text arcade-text-neon-yellow text-sm leading-tight break-words hyphens-auto">
                      {badge.description.toUpperCase()}
                    </p>
                    {badge.earned && badge.earnedDate && (
                      <div className="flex items-center justify-center space-x-1 arcade-text arcade-text-neon-green text-xs mt-2">
                        <Calendar className="w-3 h-3" />
                        <span>{badge.earnedDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="retro-card retro-card-green p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="retro-h2">CERTIFICATES</h2>
          <span className="retro-card bg-yellow-400 text-black retro-text text-xs px-3 py-1">
            {userProgress.certificates.length}
          </span>
        </div>
        
        {userProgress.certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProgress.certificates.map((certificate, index) => (
              <div key={index} className="certificate p-6">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-cyan-400" />
                  <button className="arcade-btn-status px-3 py-1 arcade-text text-xs">
                    <Download className="w-4 h-4 inline mr-1" />
                    DOWNLOAD
                  </button>
                </div>
                <h3 className="certificate-title text-lg mb-2">{certificate.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-neon-green text-xs mb-3">COMPLETED ALL REQUIREMENTS FOR THIS MODULE</p>
                <div className="flex items-center justify-between">
                  <p className="arcade-text arcade-text-neon-yellow text-xs">ISSUED: DECEMBER 2024</p>
                  <div className="certificate-seal">
                    <Star className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h3 className="arcade-text arcade-text-neon-cyan text-lg mb-2">NO CERTIFICATES YET</h3>
            <p className="arcade-text arcade-text-neon-yellow text-xs mb-4">COMPLETE LEARNING MODULES TO EARN CERTIFICATES</p>
            <button className="retro-btn retro-btn-green arcade-text text-xs">
              START LEARNING
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="arcade-card p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <h3 className="arcade-text arcade-text-neon-yellow text-xl">{userProgress.points}</h3>
          <p className="arcade-text arcade-text-neon-cyan text-xs">ECOPOINTS</p>
        </div>
        
        <div className="arcade-card p-6 text-center">
          <Star className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="arcade-text arcade-text-neon-green text-xl">{userProgress.completedLessons.length}</h3>
          <p className="arcade-text arcade-text-neon-cyan text-xs">MISSIONS</p>
        </div>
        
        <div className="arcade-card p-6 text-center">
          <Award className="w-8 h-8 text-magenta-400 mx-auto mb-3" />
          <h3 className="arcade-text arcade-text-neon-pink text-xl">{userProgress.completedChallenges.length}</h3>
          <p className="arcade-text arcade-text-neon-cyan text-xs">CHALLENGES</p>
        </div>
        
        <div className="arcade-card p-6 text-center">
          <Calendar className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <h3 className="arcade-text arcade-text-neon-cyan text-xl">{userProgress.level}</h3>
          <p className="arcade-text arcade-text-neon-cyan text-xs">LEVEL</p>
        </div>
      </div>
    </div>
  );
}