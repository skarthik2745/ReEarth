import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}


interface UserProgress {
  userId: string;
  points: number;
  level: number;
  badges: Badge[];
  completedLessons: string[];
  completedChallenges: string[];
  certificates: string[];
}

interface GameContextType {
  userProgress: UserProgress;
  addPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  completeChallenge: (challengeId: string, points?: number) => void;
  earnBadge: (badgeId: string) => void;
  leaderboard: Array<{id: string; name: string; points: number; level: number}>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

const defaultBadges: Badge[] = [
  { id: 'eco-starter', name: 'Eco Starter', description: 'Begin your eco journey', icon: '🌱', earned: false },
  { id: 'solar-hero', name: 'Solar Hero', description: 'Master solar energy', icon: '🔋', earned: false },
  { id: 'water-saver', name: 'Water Saver', description: 'Conserve precious water', icon: '💧', earned: false },
  { id: 'planet-protector', name: 'Planet Protector', description: 'Defend our world', icon: '🌍', earned: false },
  { id: 'sun-master', name: 'Sun Master', description: 'Harness solar power', icon: '🌞', earned: false },
  { id: 'recycler', name: 'Recycler', description: 'Master of recycling', icon: '♻️', earned: false },
  { id: 'green-rider', name: 'Green Rider', description: 'Eco-friendly transport', icon: '🚴', earned: false },
  { id: 'eco-champion', name: 'Eco Champion', description: 'Ultimate eco warrior', icon: '🏆', earned: false },
  { id: 'builder-tomorrow', name: 'Builder of Tomorrow', description: 'Shape the future', icon: '🛠️', earned: false },
  { id: 'seed-planter', name: 'Seed Planter', description: 'Grow new life', icon: '🌱', earned: false },
  { id: 'tree-guardian', name: 'Tree Guardian', description: 'Protect our forests', icon: '🌳', earned: false },
  { id: 'eco-warrior', name: 'Eco Warrior', description: 'Fight for nature', icon: '🦸', earned: false },
  { id: 'energy-saver', name: 'Energy Saver', description: 'Conserve power', icon: '🏅', earned: false },
  { id: 'zero-waste-pro', name: 'Zero Waste Pro', description: 'Eliminate waste', icon: '🔥', earned: false },
  { id: 'clean-future-explorer', name: 'Clean Future Explorer', description: 'Explore green tech', icon: '🚀', earned: false },
  { id: 'power-shifter', name: 'Power Shifter', description: 'Change energy systems', icon: '⚡', earned: false },
  { id: 'star-recycler', name: 'Star Recycler', description: 'Recycling champion', icon: '🌌', earned: false },
  { id: 'bright-idea', name: 'Bright Idea', description: 'Innovation master', icon: '💡', earned: false },
  { id: 'eco-defender', name: 'Eco Defender', description: 'Shield the planet', icon: '🛡️', earned: false },
  { id: 'planet-royalty', name: 'Planet Royalty', description: 'Rule with green wisdom', icon: '👑', earned: false },
  { id: 'arcade-eco-legend', name: 'Arcade Eco Legend', description: 'Gaming for the planet', icon: '🎮', earned: false },
  { id: 'ocean-protector', name: 'Ocean Protector', description: 'Save our seas', icon: '🐢', earned: false },
  { id: 'bee-friend', name: 'Bee Friend', description: 'Pollinator ally', icon: '🐝', earned: false },
  { id: 'wildlife-ally', name: 'Wildlife Ally', description: 'Animal protector', icon: '🐘', earned: false },
  { id: 'farmer-friend', name: 'Farmer Friend', description: 'Sustainable agriculture', icon: '🌾', earned: false },
  { id: 'green-innovator', name: 'Green Innovator', description: 'Eco-tech pioneer', icon: '🏡', earned: false },
  { id: 'eco-achiever', name: 'Eco Achiever', description: 'Goal crusher', icon: '🎯', earned: false },
  { id: 'mission-master', name: 'Mission Master', description: 'Complete all missions', icon: '📜', earned: false },
  { id: 'eco-hunter', name: 'Eco Hunter', description: 'Seek green solutions', icon: '🏹', earned: false },
  { id: 'lesson-completer', name: 'Lesson Completer', description: 'Knowledge seeker', icon: '🧩', earned: false }
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: '',
    points: 650,
    level: 2,
    badges: defaultBadges.map((badge, index) => ({
      ...badge,
      earned: index < 5,
      earnedDate: index < 5 ? new Date(Date.now() - (index * 24 * 60 * 60 * 1000)) : undefined
    })),
    completedLessons: ['ce-intro', 'ce-sources', 'ce-measurement'],
    completedChallenges: ['plastic-free-week', 'water-conservation', 'energy-saving'],
    certificates: ['Carbon Emission Specialist', 'Renewable Energy Expert']
  });

  const [leaderboard] = useState([
    { id: '1', name: 'Alex Green', points: 2450, level: 5 },
    { id: '2', name: 'Emma Earth', points: 1980, level: 4 },
    { id: '3', name: 'Sam Solar', points: 1750, level: 4 },
    { id: '4', name: 'Luna Lake', points: 1420, level: 3 },
    { id: '5', name: 'River Stone', points: 1180, level: 3 },
    { id: '6', name: 'Maya Forest', points: 950, level: 2 },
    { id: '7', name: 'Ocean Blue', points: 820, level: 2 },
    { id: '8', name: 'Sky Walker', points: 680, level: 2 },
    { id: '9', name: 'Earth Angel', points: 540, level: 2 },
    { id: '10', name: 'Green Leaf', points: 420, level: 1 }
  ]);

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress(prev => ({ ...prev, userId: user.id }));
      }
    }
  }, [user]);

  const saveProgress = (newProgress: UserProgress) => {
    setUserProgress(newProgress);
    if (user) {
      localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
    }
  };

  const addPoints = (points: number) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      newProgress.points += points;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      if (user) {
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
      }
      return newProgress;
    });
  };

  const completeLesson = (lessonId: string) => {
    if (!userProgress.completedLessons.includes(lessonId)) {
      const newProgress = { ...userProgress };
      newProgress.completedLessons.push(lessonId);
      newProgress.points += 50;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      saveProgress(newProgress);
    }
  };

  const completeChallenge = (challengeId: string, points: number = 100) => {
    if (!userProgress.completedChallenges.includes(challengeId)) {
      const newProgress = { ...userProgress };
      newProgress.completedChallenges.push(challengeId);
      newProgress.points += points;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      saveProgress(newProgress);
    }
  };

  const earnBadge = (badgeId: string) => {
    const newProgress = { ...userProgress };
    const badge = newProgress.badges.find(b => b.id === badgeId);
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = new Date();
      saveProgress(newProgress);
      addPoints(200);
    }
  };

  const value = {
    userProgress,
    addPoints,
    completeLesson,
    completeChallenge,
    earnBadge,
    leaderboard
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}