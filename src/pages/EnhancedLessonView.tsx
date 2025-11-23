import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById, getModuleById } from '../data/complete50Lessons';
import { generateLessonContent, generateLessonContentLegacy } from '../services/geminiApi';
import TextToSpeech from '../components/TextToSpeech';
import { ArrowLeft, CheckCircle, Play, Target, Brain, Clock, Award } from 'lucide-react';

export default function EnhancedLessonView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { userProgress, addPoints } = useGame();
  const [dynamicContent, setDynamicContent] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const lesson = getLessonById(lessonId!);
  const module = getModuleById(moduleId!);

  useEffect(() => {
    if (lesson) {
      const cachedContent = localStorage.getItem(`lesson_content_${lesson.id}`);
      if (cachedContent) {
        try {
          setDynamicContent(JSON.parse(cachedContent));
        } catch {
          setDynamicContent(null);
          loadDynamicContent();
        }
      } else {
        loadDynamicContent();
      }
      
      // Check completion status
      const quizKey = `quiz_completed_${lesson.id}`;
      const challengeKey = `challenge_completed_${lesson.id}`;
      setQuizCompleted(localStorage.getItem(quizKey) === 'true');
      setChallengeCompleted(localStorage.getItem(challengeKey) === 'true');
    }
  }, [lesson]);

  const loadDynamicContent = async () => {
    if (!lesson) return;
    
    setIsLoadingContent(true);
    try {
      const content = await generateLessonContent(lesson.title);
      setDynamicContent(content);
      localStorage.setItem(`lesson_content_${lesson.id}`, JSON.stringify(content));
    } catch (error) {
      setDynamicContent({ content_html: lesson.content, tts_text: lesson.content });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const renderContentCards = (content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      if (section.startsWith('##')) {
        return (
          <div key={index} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold">{section.replace('##', '').trim()}</h2>
          </div>
        );
      } else if (section.startsWith('#')) {
        return (
          <div key={index} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold">{section.replace('#', '').trim()}</h3>
          </div>
        );
      } else {
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
            <div className="prose prose-gray max-w-none">
              {section.split('\n').map((line, lineIndex) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <li key={lineIndex} className="text-gray-700 mb-2 ml-4 list-disc">
                      {line.replace(/^[•-]\s*/, '')}
                    </li>
                  );
                }
                return line.trim() ? (
                  <p key={lineIndex} className="text-gray-700 mb-3 leading-relaxed">
                    {line}
                  </p>
                ) : null;
              })}
            </div>
          </div>
        );
      }
    });
  };

  const isLessonComplete = quizCompleted && challengeCompleted;
  const progressPercentage = ((quizCompleted ? 1 : 0) + (challengeCompleted ? 1 : 0)) / 2 * 100;

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Link>
        
        <div className="arcade-dialog p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{module.icon}</span>
                <div>
                  <p className="arcade-text arcade-text-cyan text-xs">{module.title.toUpperCase()}</p>
                  <h1 className="arcade-h1">{lesson.title.toUpperCase()}</h1>
                </div>
              </div>
              
              <p className="arcade-text arcade-text-yellow mb-4">{lesson.description.toUpperCase()}</p>
              
              <div className="flex items-center gap-6 arcade-text text-xs">
                <div className="flex items-center arcade-text-green">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.duration} MIN
                </div>
                <div className="flex items-center arcade-text-green">
                  <Award className="h-4 w-4 mr-1" />
                  {lesson.points} PTS
                </div>
              </div>
            </div>
            
            {isLessonComplete && (
              <div className="arcade-card arcade-card-yellow px-4 py-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  <span className="arcade-text arcade-text-green">COMPLETE</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between arcade-text text-xs arcade-text-yellow mb-2">
              <span>MISSION PROGRESS</span>
              <span>{Math.round(progressPercentage)}% COMPLETE</span>
            </div>
            <div className="arcade-progress">
              <div 
                className="arcade-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Text-to-Speech */}
      <div className="mb-6">
        <TextToSpeech text={
          dynamicContent ? 
            `${lesson.title}. ${(dynamicContent.content_html || '').replace(/<[^>]*>/g, '')} ${dynamicContent.key_takeaways ? 'Key Takeaways: ' + dynamicContent.key_takeaways.join('. ') : ''} ${dynamicContent.case_study ? 'Case Study: ' + dynamicContent.case_study.title + '. ' + dynamicContent.case_study.text : ''} ${dynamicContent.faqs ? 'Frequently Asked Questions: ' + dynamicContent.faqs.map(faq => faq.q + ' ' + faq.a).join('. ') : ''}` :
            `${lesson.title}. ${lesson.description}. ${lesson.content}`
        } />
      </div>

      {/* Lesson Content Cards */}
      <div className="mb-8">
        {isLoadingContent ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating personalized content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Content */}
            <div className="arcade-dialog p-8">
              <div 
                className="arcade-text text-white leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: (dynamicContent?.content_html || `<h1>${lesson.title}</h1><p>${lesson.description}</p><div>${lesson.content}</div>`)
                    .replace(/<h1[^>]*>/g, '<h1 class="arcade-h1 mb-4">')
                    .replace(/<h2[^>]*>/g, '<h2 class="arcade-h2 mb-3">')
                    .replace(/<h3[^>]*>/g, '<h3 class="arcade-h3 mb-2">')
                    .replace(/<p[^>]*>/g, '<p class="arcade-text text-white mb-3">')
                }}
              />
            </div>
            
            {/* Key Takeaways */}
            {dynamicContent?.key_takeaways && (
              <div className="arcade-dialog p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-400 border-2 border-white p-2 mr-4">
                    <CheckCircle className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="arcade-h2">KEY TAKEAWAYS</h3>
                </div>
                <div className="grid gap-4">
                  {dynamicContent.key_takeaways.map((takeaway: string, index: number) => (
                    <div key={index} className="arcade-card arcade-card-cyan p-4">
                      <div className="flex items-start">
                        <div className="bg-green-400 border border-white p-1 mr-3 mt-1">
                          <CheckCircle className="h-4 w-4 text-black" />
                        </div>
                        <p className="arcade-text arcade-text-yellow">{takeaway.toUpperCase()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Case Study */}
            {dynamicContent?.case_study && (
              <div className="arcade-dialog p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-cyan-400 border-2 border-white p-2 mr-4">
                    <Brain className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="arcade-h2">CASE STUDY</h3>
                </div>
                <div className="arcade-card arcade-card-magenta p-6">
                  <h4 className="arcade-h3 mb-4">{dynamicContent.case_study.title.toUpperCase()}</h4>
                  <p className="arcade-text text-white leading-relaxed">{dynamicContent.case_study.text}</p>
                </div>
              </div>
            )}
            
            {/* FAQs */}
            {dynamicContent?.faqs && dynamicContent.faqs.length > 0 && (
              <div className="arcade-dialog p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-400 border-2 border-white p-2 mr-4">
                    <Target className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="arcade-h2">FREQUENTLY ASKED QUESTIONS</h3>
                </div>
                <div className="space-y-4">
                  {dynamicContent.faqs.map((faq: any, index: number) => (
                    <div key={index} className="arcade-card arcade-card-yellow p-6">
                      <h4 className="arcade-h3 mb-3">{faq.q.toUpperCase()}</h4>
                      <p className="arcade-text text-white leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Take Quiz */}
        <div className="arcade-card p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-magenta-400 border-2 border-white mb-4">
              <Brain className="h-6 w-6 text-black" />
            </div>
            <h3 className="arcade-text arcade-text-neon-cyan mb-2 text-sm">TAKE QUIZ</h3>
            <p className="arcade-text arcade-text-neon-yellow text-xs mb-4">TEST KNOWLEDGE - 10 QUESTIONS</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {quizCompleted ? (
                <div className="status-complete px-2 py-1 text-xs">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  COMPLETE
                </div>
              ) : (
                <div className="status-incomplete px-2 py-1 text-xs">
                  NOT STARTED
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`/quiz/${moduleId}/${lessonId}`)}
              className="arcade-btn-quiz w-full py-2 px-4 arcade-text text-xs"
            >
              {quizCompleted ? 'RETAKE QUIZ' : 'START QUIZ'}
            </button>
          </div>
        </div>

        {/* Eco Challenge */}
        <div className="arcade-card arcade-card-green p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-400 border-2 border-white mb-4">
              <Target className="h-6 w-6 text-black" />
            </div>
            <h3 className="arcade-text arcade-text-neon-cyan mb-2 text-sm">ECO MISSION</h3>
            <p className="arcade-text arcade-text-neon-yellow text-xs mb-4">REAL-WORLD ACTION REQUIRED</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {challengeCompleted ? (
                <div className="status-complete px-2 py-1 text-xs">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  COMPLETE
                </div>
              ) : (
                <div className="status-incomplete px-2 py-1 text-xs">
                  NOT STARTED
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`/eco-challenge/${lessonId}`)}
              className="arcade-btn-mission w-full py-2 px-4 arcade-text text-xs"
            >
              {challengeCompleted ? 'VIEW MISSION' : 'START MISSION'}
            </button>
          </div>
        </div>

        {/* Mark Complete */}
        <div className="arcade-card p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-400 border-2 border-white mb-4">
              <CheckCircle className="h-6 w-6 text-black" />
            </div>
            <h3 className="arcade-text arcade-text-neon-cyan mb-2 text-sm">MISSION STATUS</h3>
            <p className="arcade-text arcade-text-neon-yellow text-xs mb-4">COMPLETE ALL REQUIREMENTS</p>
            <div className="mb-4">
              <div className="arcade-text arcade-text-neon-cyan text-xs mb-2">REQUIREMENTS:</div>
              <div className="space-y-1">
                <div className={`flex items-center arcade-text text-xs ${
                  quizCompleted ? 'arcade-text-neon-green' : 'arcade-text-neon-red'
                }`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  QUIZ COMPLETE
                </div>
                <div className={`flex items-center arcade-text text-xs ${
                  challengeCompleted ? 'arcade-text-neon-green' : 'arcade-text-neon-red'
                }`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  MISSION COMPLETE
                </div>
              </div>
            </div>
            <button
              disabled={!isLessonComplete}
              className={`w-full py-2 px-4 arcade-text text-xs ${
                isLessonComplete 
                  ? 'arcade-btn-status' 
                  : 'status-incomplete cursor-not-allowed'
              }`}
            >
              {isLessonComplete ? 'MISSION COMPLETE!' : 'INCOMPLETE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}