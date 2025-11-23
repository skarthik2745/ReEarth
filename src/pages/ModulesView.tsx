import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { complete50LessonModules } from '../data/complete50Lessons';
import { ChevronDown, ChevronRight, CheckCircle, Play, Clock, Award } from 'lucide-react';

export default function ModulesView() {
  const { userProgress } = useGame();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    const quizCompleted = localStorage.getItem(`quiz_completed_${lessonId}`) === 'true';
    const challengeCompleted = localStorage.getItem(`challenge_completed_${lessonId}`) === 'true';
    return quizCompleted && challengeCompleted;
  };

  const getModuleProgress = (moduleId: string) => {
    const module = complete50LessonModules.find(m => m.id === moduleId);
    if (!module) return 0;
    const completedCount = module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="retro-h1 mb-4">ReEarth MODULES</h1>
        <p className="retro-text retro-text-yellow">COMPLETE ALL 50 MISSIONS ACROSS 6 WORLDS</p>
      </div>

      <div className="space-y-4">
        {complete50LessonModules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const progress = getModuleProgress(module.id);
          const completedLessons = module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;

          return (
            <div key={module.id} className="retro-dialog mb-6">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-6 text-left hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{module.icon}</span>
                    <div>
                      <h2 className="retro-h2">{module.title.toUpperCase()}</h2>
                      <p className="retro-text retro-text-cyan text-xs mt-2">{module.description.toUpperCase()}</p>
                      <div className="flex items-center gap-4 mt-3 retro-text text-xs">
                        <span className="retro-text-green">{module.lessons.length} MISSIONS</span>
                        <span className="retro-text-yellow">{module.estimatedTime}H PLAYTIME</span>
                        <span className="retro-text-magenta">{completedLessons}/{module.lessons.length} COMPLETE</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="retro-text retro-text-yellow mb-2">{progress}% COMPLETE</div>
                      <div className="w-32 bg-black border-2 border-white h-3">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-cyan-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Lessons Grid */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {module.lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(lesson.id);
                      
                      return (
                        <div key={lesson.id} className={`retro-card ${completed ? 'retro-card-green' : 'retro-card-red'} p-4 hover:scale-105 transition-all duration-200`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="retro-text text-xs bg-black border border-white px-2 py-1">
                                MISSION {index + 1}
                              </span>
                              {completed && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 retro-text text-xs retro-text-yellow">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}M
                            </div>
                          </div>

                          <h3 className="retro-h3 mb-2 text-xs leading-tight">
                            {lesson.title.toUpperCase()}
                          </h3>
                          
                          <p className="retro-text retro-text-cyan text-xs mb-3 leading-tight">
                            {lesson.description.toUpperCase()}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 retro-text text-xs retro-text-green">
                              <Award className="h-3 w-3" />
                              {lesson.points} PTS
                            </div>
                            
                            <Link
                              to={`/lesson/${module.id}/${lesson.id}`}
                              className={`retro-btn text-xs px-2 py-1 ${
                                completed
                                  ? 'retro-btn-green'
                                  : 'retro-btn-red'
                              }`}
                            >
                              {completed ? (
                                <>
                                  <CheckCircle className="h-3 w-3 inline mr-1" />
                                  REVIEW
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 inline mr-1" />
                                  START
                                </>
                              )}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 retro-dialog">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center p-6">
          <div className="retro-card retro-card-magenta p-4">
            <div className="retro-h2 text-green-400">
              {complete50LessonModules.reduce((sum, module) => sum + module.lessons.length, 0)}
            </div>
            <div className="retro-text retro-text-yellow text-xs mt-2">TOTAL MISSIONS</div>
          </div>
          <div className="retro-card retro-card-red p-4">
            <div className="retro-h2 text-cyan-400">
              {complete50LessonModules.reduce((sum, module) => 
                sum + module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length, 0
              )}
            </div>
            <div className="retro-text retro-text-yellow text-xs mt-2">COMPLETED</div>
          </div>
          <div className="retro-card p-4">
            <div className="retro-h2 text-magenta-400">{userProgress.points}</div>
            <div className="retro-text retro-text-yellow text-xs mt-2">ReEarth POINTS</div>
          </div>
          <div className="retro-card retro-card-magenta p-4">
            <div className="retro-h2 text-yellow-400">{userProgress.level}</div>
            <div className="retro-text retro-text-yellow text-xs mt-2">LEVEL</div>
          </div>
        </div>
      </div>
    </div>
  );
}