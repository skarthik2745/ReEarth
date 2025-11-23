import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById, getModuleById } from '../data/complete50Lessons';
import { generateQuizQuestions } from '../services/geminiApi';
import { ArrowLeft, CheckCircle, X, Trophy, Brain, Loader, RotateCcw } from 'lucide-react';

export default function QuizView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { addPoints, earnBadge } = useGame();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const lesson = getLessonById(lessonId!);
  const module = getModuleById(moduleId!);

  useEffect(() => {
    if (lesson) {
      loadQuizQuestions();
    }
  }, [lesson]);

  const loadQuizQuestions = async () => {
    if (!lesson) return;
    
    setIsLoadingQuestions(true);
    try {
      const generatedQuestions = await generateQuizQuestions(lesson.title);
      setQuestions(generatedQuestions.slice(0, 10)); // Ensure exactly 10 questions
    } catch (error) {
      console.error('Failed to load quiz questions:', error);
      // Fallback to static questions if available
      if (lesson.quiz) {
        setQuestions(lesson.quiz.questions);
      }
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setAttemptCount(prev => prev + 1);
    loadQuizQuestions(); // Generate new questions
  };

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Award points based on attempt and score
    let finalPoints = 0;
    if (finalScore >= 70) { // Passing score
      if (attemptCount === 0) {
        finalPoints = finalScore; // Full points for first attempt
      } else {
        finalPoints = Math.round(finalScore * 0.3); // 30% points for retries
      }
      addPoints(finalPoints);
      
      // Mark quiz as completed
      localStorage.setItem(`quiz_completed_${lessonId}`, 'true');
      
      if (finalScore === 100 && attemptCount === 0) {
        earnBadge('quiz-master');
      }
    }
  };

  const isQuestionCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question && selectedAnswers[questionId] === question.correctAnswer;
  };

  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/lesson/${moduleId}/${lessonId}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-magenta-400 border-2 border-white">
            <Brain className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="arcade-text arcade-text-neon-cyan text-xs">{module.title.toUpperCase()} • {lesson.title.toUpperCase()}</p>
            <h1 className="arcade-text arcade-text-neon-cyan text-2xl">KNOWLEDGE QUIZ</h1>
          </div>
        </div>

        {!showResults && (
          <div className="arcade-card arcade-card-cyan p-4">
            <div className="flex items-center justify-between arcade-text text-xs">
              <span className="arcade-text-neon-yellow">
                {Object.keys(selectedAnswers).length} OF {questions.length} ANSWERED
              </span>
              <div className="flex items-center gap-4">
                {attemptCount > 0 && (
                  <span className="arcade-text-neon-pink">
                    ATTEMPT #{attemptCount + 1} (30% PTS)
                  </span>
                )}
                <span className="arcade-text-neon-green">
                  PASS: 70%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Content */}
      <div className="arcade-dialog">
        <div className="p-8">
          {isLoadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Generating quiz questions...</span>
            </div>
          ) : !showResults ? (
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="arcade-text arcade-text-neon-yellow mb-4">
                        {question.question.toUpperCase()}
                      </h3>
                      
                      <div className="space-y-3">
                        {question.options?.map((option, optionIndex) => (
                          <label 
                            key={optionIndex}
                            className={`quiz-option flex items-center p-4 cursor-pointer ${
                              selectedAnswers[question.id] === option ? 'selected' : ''
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              onChange={() => handleAnswerSelect(question.id, option)}
                              className="w-4 h-4 accent-cyan-400 mr-3"
                            />
                            <span className="arcade-text text-xs">{option.toUpperCase()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allQuestionsAnswered}
                  className="arcade-btn arcade-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SUBMIT QUIZ
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 border-4 border-white mb-6 ${
                score >= 70 ? 'bg-green-400' : 'bg-red-400'
              }`}>
                {score >= 70 ? (
                  <Trophy className="h-8 w-8 text-black" />
                ) : (
                  <X className="h-8 w-8 text-black" />
                )}
              </div>
              
              <h2 className={`arcade-text text-2xl mb-4 ${
                score >= 70 ? 'arcade-text-neon-green' : 'arcade-text-neon-red'
              }`}>
                {score >= 70 ? 'MISSION SUCCESS!' : 'MISSION FAILED!'}
              </h2>
              
              <p className="arcade-text arcade-text-neon-yellow mb-6">
                SCORE: {score}% ({questions.filter(q => isQuestionCorrect(q.id)).length}/{questions.length} CORRECT)
              </p>

              {score >= 70 && (
                <div className="mission-result p-4 mb-6">
                  <p className="arcade-text arcade-text-neon-green">
                    +{attemptCount === 0 ? score : Math.round(score * 0.3)} ECOPOINTS EARNED!
                  </p>
                  {attemptCount > 0 && (
                    <p className="arcade-text arcade-text-neon-red text-xs mt-1">
                      RETRY PENALTY - 30% POINTS ONLY
                    </p>
                  )}
                </div>
              )}

              {score < 70 && (
                <div className="mission-result p-4 mb-6">
                  <p className="arcade-text arcade-text-neon-red">
                    MISSION FAILED! MINIMUM 70% REQUIRED. TRY AGAIN!
                  </p>
                </div>
              )}

              {/* Answer Review */}
              <div className="text-left space-y-6 mb-8">
                <h3 className="arcade-text arcade-text-neon-cyan text-lg">ANSWER REVIEW</h3>
                {questions.map((question, index) => (
                  <div key={question.id} className="quiz-review-container p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 border-2 border-white flex items-center justify-center ${
                        isQuestionCorrect(question.id) ? 'bg-green-400' : 'bg-red-400'
                      }`}>
                        {isQuestionCorrect(question.id) ? (
                          <CheckCircle className="h-4 w-4 text-black" />
                        ) : (
                          <X className="h-4 w-4 text-black" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="arcade-text arcade-text-neon-cyan mb-2 text-sm">{question.question.toUpperCase()}</p>
                        <p className="arcade-text text-xs mb-2">
                          <span className="arcade-text-neon-yellow">YOUR ANSWER:</span> 
                          <span className={`ml-2 ${isQuestionCorrect(question.id) ? 'arcade-text-neon-green' : 'arcade-text-neon-red'}`}>
                            {selectedAnswers[question.id]?.toUpperCase()}
                          </span>
                        </p>
                        <p className="arcade-text text-xs mb-2">
                          <span className="arcade-text-neon-yellow">CORRECT ANSWER:</span> 
                          <span className="arcade-text-neon-green ml-2">{question.correctAnswer?.toUpperCase()}</span>
                        </p>
                        <p className="arcade-text arcade-text-neon-yellow text-xs">{question.explanation?.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                {score < 70 && (
                  <button
                    onClick={retryQuiz}
                    className="arcade-btn-quiz flex items-center gap-2 px-4 py-2 arcade-text text-xs"
                  >
                    <RotateCcw className="h-4 w-4" />
                    RETRY QUIZ
                  </button>
                )}
                <Link
                  to={`/lesson/${moduleId}/${lessonId}`}
                  className="arcade-btn-status px-4 py-2 arcade-text text-xs"
                >
                  BACK TO MISSION
                </Link>
                <Link
                  to="/dashboard"
                  className="arcade-btn-mission px-4 py-2 arcade-text text-xs"
                >
                  CONTINUE
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}