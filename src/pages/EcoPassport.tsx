import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Trophy, Award, Calendar, Target, Leaf, Zap } from 'lucide-react';

export default function EcoPassport() {
  const { userProgress } = useGame();

  const badges = [
    { id: 1, name: 'Plastic-Free Hero', icon: '🏆', earned: true },
    { id: 2, name: 'Water Guardian', icon: '💧', earned: true },
    { id: 3, name: 'Energy Saver', icon: '⚡', earned: true },
    { id: 4, name: 'Carbon Cutter', icon: '🌱', earned: true }
  ];

  const recentActivity = [
    { type: 'challenge', text: 'Completed 7-Day Plastic-Free Week', date: '2 days ago' },
    { type: 'quiz', text: 'Scored 85% in Carbon Emissions Quiz', date: '3 days ago' },
    { type: 'badge', text: 'Unlocked Water Guardian Badge', date: '1 week ago' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ECO PASSPORT</h1>
        <p className="arcade-text arcade-text-yellow">YOUR SUSTAINABILITY JOURNEY</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="arcade-dialog p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-cyan-400 border-4 border-white mx-auto mb-4 flex items-center justify-center">
              <span className="arcade-h1 text-black">P</span>
            </div>
            <h2 className="arcade-h2 mb-2">PRIYA K</h2>
            <p className="arcade-text arcade-text-cyan">CLASS 10-A</p>
          </div>

          <div className="space-y-4">
            <div className="arcade-card arcade-card-green p-4">
              <div className="flex items-center justify-between">
                <span className="arcade-text arcade-text-yellow">ECO POINTS</span>
                <span className="arcade-h3 text-green-400">{userProgress.points}</span>
              </div>
            </div>

            <div className="arcade-card p-4">
              <div className="flex items-center justify-between">
                <span className="arcade-text arcade-text-yellow">LESSONS</span>
                <span className="arcade-text arcade-text-cyan">5/7</span>
              </div>
            </div>

            <div className="arcade-card p-4">
              <div className="flex items-center justify-between">
                <span className="arcade-text arcade-text-yellow">CHALLENGES</span>
                <span className="arcade-text arcade-text-cyan">12</span>
              </div>
            </div>

            <div className="arcade-card arcade-card-magenta p-4">
              <div className="flex items-center justify-between">
                <span className="arcade-text arcade-text-yellow">CARBON SAVED</span>
                <span className="arcade-text arcade-text-green">1.8 KG CO₂</span>
              </div>
            </div>

            <div className="arcade-card arcade-card-red p-4">
              <div className="flex items-center justify-between">
                <span className="arcade-text arcade-text-yellow">STREAK</span>
                <span className="arcade-text arcade-text-yellow">4 DAYS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="arcade-dialog p-6">
          <h3 className="arcade-h2 mb-4 text-center">BADGES EARNED</h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map(badge => (
              <div key={badge.id} className={`arcade-card p-4 text-center ${badge.earned ? 'arcade-card-green' : 'arcade-card-red opacity-50'}`}>
                <div className="text-2xl mb-2">{badge.icon}</div>
                <div className="arcade-text text-xs">{badge.name.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="arcade-dialog p-6">
          <h3 className="arcade-h2 mb-4 text-center">RECENT ACTIVITY</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="arcade-card p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-cyan-400 border-2 border-white flex items-center justify-center">
                    {activity.type === 'challenge' && <Target className="w-4 h-4 text-black" />}
                    {activity.type === 'quiz' && <Trophy className="w-4 h-4 text-black" />}
                    {activity.type === 'badge' && <Award className="w-4 h-4 text-black" />}
                  </div>
                  <div className="flex-1">
                    <p className="arcade-text arcade-text-cyan text-xs">{activity.text.toUpperCase()}</p>
                    <p className="arcade-text arcade-text-yellow text-xs mt-1">{activity.date.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}