import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { complete50LessonModules as modules, getModuleProgress } from '../data/complete50Lessons';
import { Book, Trophy, Target, Zap, Leaf, Factory, TreePine, Sun, Recycle, FileText, Star, TrendingUp, Award, BookOpen, Users, Clock, Play, CheckCircle } from 'lucide-react';



const recentChallenges = [
  {
    id: '1',
    title: 'Plant a Tree',
    description: 'Plant a tree or sapling and document its growth',
    points: 150,
    difficulty: 'Easy',
    timeEstimate: '30 minutes'
  },
  {
    id: '2',
    title: 'Energy Audit',
    description: 'Conduct a home energy audit and identify savings',
    points: 200,
    difficulty: 'Medium',
    timeEstimate: '2 hours'
  },
  {
    id: '3',
    title: 'Zero Waste Day',
    description: 'Challenge yourself to produce zero waste for a day',
    points: 250,
    difficulty: 'Hard',
    timeEstimate: 'Full day'
  }
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { userProgress, leaderboard } = useGame();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = userProgress.completedLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  console.log('Total modules:', modules.length);
  console.log('Total lessons:', totalLessons);
  console.log('Modules:', modules.map(m => ({ id: m.id, title: m.title, lessons: m.lessons.length })));

  const recentAchievements = userProgress.badges
    .filter(badge => badge.earned)
    .slice(-2)
    .map(badge => ({
      id: badge.id,
      title: badge.name,
      description: badge.description,
      icon: badge.icon,
      date: badge.earnedDate ? new Date(badge.earnedDate).toLocaleDateString() : 'Recently'
    }));

  const nextLevelPoints = userProgress.level * 500;
  const currentLevelPoints = (userProgress.level - 1) * 500;
  const progressToNext = ((userProgress.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8 text-center">
        <h1 className="retro-h1 mb-4">
          {greeting.toUpperCase()}, {user?.name.toUpperCase()}! 🌍
        </h1>
        <p className="retro-text retro-text-yellow">
          READY TO SAVE THE PLANET TODAY?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="retro-card retro-card-red p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">ECOPOINTS</p>
              <p className="retro-h2 text-green-400">{userProgress.points.toLocaleString()}</p>
              <div className="mt-2">
                <div className="flex justify-between retro-text text-xs retro-text-cyan mb-1">
                  <span>LV {userProgress.level}</span>
                  <span>{nextLevelPoints - userProgress.points} TO NEXT</span>
                </div>
                <div className="w-full bg-black border border-white h-2">
                  <div 
                    className="h-full bg-green-400"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-400 border-2 border-white">
              <Star className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">CURRENT LEVEL</p>
              <p className="retro-h2 text-cyan-400">{userProgress.level}</p>
              <p className="retro-text text-xs retro-text-magenta mt-1">
                {userProgress.level < 5 ? 'ECO ROOKIE' :
                 userProgress.level < 10 ? 'ECO FIGHTER' :
                 userProgress.level < 15 ? 'ECO WARRIOR' : 'ECO MASTER'}
              </p>
            </div>
            <div className="p-3 bg-cyan-400 border-2 border-white">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card retro-card-magenta p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">BADGES EARNED</p>
              <p className="retro-h2 text-magenta-400">
                {userProgress.badges.filter(b => b.earned).length}/{userProgress.badges.length}
              </p>
              <p className="retro-text text-xs retro-text-green mt-1">
                {Math.round((userProgress.badges.filter(b => b.earned).length / userProgress.badges.length) * 100)}% COMPLETE
              </p>
            </div>
            <div className="p-3 bg-magenta-400 border-2 border-white">
              <Award className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card retro-card-red p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">MISSIONS DONE</p>
              <p className="retro-h2 text-yellow-400">
                {completedLessons}
              </p>
              <p className="retro-text text-xs retro-text-cyan mt-1">
                {userProgress.completedChallenges.length} CHALLENGES
              </p>
            </div>
            <div className="p-3 bg-yellow-400 border-2 border-white">
              <BookOpen className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Modules */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Learning Modules</h2>
            <span className="text-sm text-gray-500">
              {modules.length} modules available
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const progress = getModuleProgress(module.id, userProgress.completedLessons);
              const isCompleted = progress === 100;
              const isStarted = progress > 0;
              
              return (
                <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                  <div className={`h-2 bg-gradient-to-r ${module.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center flex-1">
                        <span className="text-3xl mr-3">{module.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{module.lessons.length} lessons</span>
                            <span>{module.estimatedTime}h estimated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${module.color} transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {module.badge.name}
                        </span>
                      </div>
                      <Link
                        to={`/lesson/${module.id}/${module.lessons[0].id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCompleted 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : isStarted
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {isCompleted ? (
                          <><CheckCircle className="h-4 w-4" /> Review</>
                        ) : isStarted ? (
                          <><Play className="h-4 w-4" /> Continue</>
                        ) : (
                          <><Play className="h-4 w-4" /> Start</>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Challenges & Achievements */}
        <div className="space-y-8">
          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Complete lessons to earn badges!</p>
                </div>
              )}
            </div>
            <Link 
              to="/profile"
              className="block mt-4 text-center text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View All Badges
            </Link>
          </div>

          {/* Eco Challenges */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Eco Challenges
            </h3>
            <div className="space-y-3">
              {recentChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  className="block border border-gray-200 rounded-lg p-3 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{challenge.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="text-green-600 font-medium">+{challenge.points} pts</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {challenge.timeEstimate}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Leaderboard
              </h3>
              <Link 
                to="/leaderboard" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboard.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.points.toLocaleString()} points • Level {user.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}