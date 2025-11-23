import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById, getModuleById } from '../data/complete50Lessons';
import { generateLessonContent } from '../services/geminiApi';
import TextToSpeech from '../components/TextToSpeech';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Award, CheckCircle, Target, Loader } from 'lucide-react';

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson, earnBadge, userProgress } = useGame();
  const [isCompleted, setIsCompleted] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const lesson = getLessonById(lessonId!);
  const module = getModuleById(moduleId!);

  useEffect(() => {
    if (lesson && userProgress.completedLessons.includes(lesson.id)) {
      setIsCompleted(true);
    }
    
    // Generate dynamic content if not already cached
    if (lesson && !dynamicContent) {
      const cachedContent = localStorage.getItem(`lesson_content_${lesson.id}`);
      if (cachedContent) {
        setDynamicContent(cachedContent);
      } else {
        loadDynamicContent();
      }
    }
  }, [lesson, userProgress.completedLessons]);

  const loadDynamicContent = async () => {
    if (!lesson) return;
    
    setIsLoadingContent(true);
    try {
      const content = await generateLessonContent(lesson.title);
      setDynamicContent(content);
      localStorage.setItem(`lesson_content_${lesson.id}`, content);
    } catch (error) {
      console.error('Failed to load dynamic content:', error);
      setDynamicContent(lesson.content); // Fallback to static content
    } finally {
      setIsLoadingContent(false);
    }
  };

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentLessonIndex = module.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentLessonIndex < module.lessons.length - 1 ? module.lessons[currentLessonIndex + 1] : null;

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      completeLesson(lesson.id);
      setIsCompleted(true);
      
      if (lesson.requiredForBadge) {
        earnBadge(lesson.requiredForBadge);
      }
      
      if (currentLessonIndex === 0) {
        earnBadge('first-lesson');
      }
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/lesson/${moduleId}/${nextLesson.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{module.icon}</span>
              <div>
                <p className="text-sm text-gray-600">{module.title}</p>
                <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{lesson.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.duration} minutes
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {lesson.points} points
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Text-to-Speech Controls */}
      <div className="mb-4">
        <TextToSpeech 
          text={dynamicContent || lesson.content}
          className="justify-end"
        />
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-8">
          {isLoadingContent ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-600">Generating personalized content...</span>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              {(dynamicContent || lesson.content).split('\n').map((paragraph, index) => {
                if (paragraph.trim() === '') return null;
                
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace('##', '').trim()}
                    </h2>
                  );
                }
                
                if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                  return (
                    <li key={index} className="ml-6 text-gray-700 list-disc">
                      {paragraph.replace(/^[•-]/, '').trim()}
                    </li>
                  );
                }
                
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Eco Challenge */}
      {lesson.ecoChallenge && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco Challenge: {lesson.ecoChallenge.title}</h3>
              <p className="text-gray-700 mb-4">{lesson.ecoChallenge.description}</p>
              
              <Link
                to={`/challenge/${lesson.ecoChallenge.id}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Challenge
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleCompleteLesson}
          disabled={isCompleted}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isCompleted
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          {isCompleted ? 'Lesson Completed' : 'Mark as Complete'}
        </button>
        
        <div className="flex space-x-4">
          {lesson.quiz && (
            <Link
              to={`/quiz/${moduleId}/${lessonId}`}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Take Quiz
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          )}
          
          {nextLesson && (
            <button
              onClick={handleNextLesson}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next Lesson
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}