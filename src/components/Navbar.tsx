import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Leaf, Home, Book, Trophy, User, LogOut, GraduationCap, Users, Calendar, Brain, Gamepad2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { userProgress } = useGame();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const studentNav = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/challenges', icon: Trophy, label: 'Challenges' },
    { path: '/projects', icon: Book, label: 'Projects' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/trivia', icon: Brain, label: 'Trivia' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/forest', icon: Leaf, label: 'Forest' },
    { path: '/calculator', icon: Users, label: 'Calculator' },
    { path: '/forum', icon: Users, label: 'Forum' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' }
  ];

  const teacherNav = [
    { path: '/teacher', icon: GraduationCap, label: 'Dashboard' },
    { path: '/teacher-analytics', icon: Users, label: 'Analytics' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/forum', icon: Users, label: 'Forum' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const navItems = user?.role === 'student' ? studentNav : teacherNav;

  return (
    <nav className="bg-black border-b-4 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row - Logo and User Info */}
        <div className="flex justify-between items-center h-16 border-b-2 border-gray-700">
          <Link to="/dashboard" className="flex items-center space-x-3 retro-text-cyan hover:text-yellow-400 transition-colors">
            <div className="bg-cyan-400 p-2 border-2 border-white">
              <Leaf className="w-6 h-6 text-black" />
            </div>
            <span className="retro-h3">ReEarth</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user?.role === 'student' && (
              <div className="retro-card px-3 py-1">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="retro-text retro-text-cyan">{userProgress.points} PTS</span>
                  <span className="retro-text retro-text-green">LV{userProgress.level}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-magenta-500 border-2 border-white flex items-center justify-center">
                <span className="retro-text text-white">{user?.name.charAt(0)}</span>
              </div>
              <span className="hidden md:block retro-text retro-text-cyan text-xs">{user?.name.toUpperCase()}</span>
            </div>

            <button onClick={logout} className="retro-btn retro-btn-red" title="LOGOUT">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row - Navigation Links */}
        <div className="flex justify-center py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 retro-text nav-hover transition-colors whitespace-nowrap ${
                  isActive(path)
                    ? 'retro-text-yellow bg-gray-900 border-2 border-yellow-400'
                    : 'retro-text-cyan hover:retro-text-yellow'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs uppercase">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

}