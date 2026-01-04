import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Brain, Award, AlertCircle, ArrowRight, Check, Loader } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function EcoTrivia() {
  const { user } = useAuth();
  const { userProgress, updatePoints } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuestion = async (): Promise<Question> => {
    setLoading(true);
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Generate 1 environmental sustainability trivia question for students. Topics: renewable energy, climate change, pollution, conservation, recycling, carbon footprint, biodiversity, sustainable living.

Return ONLY valid JSON:
{
  "question": "Question about environmental topic?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0
}`
          }],
          temperature: 0.8,
          max_tokens: 300
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const questionData = JSON.parse(jsonMatch[0]);
          return {
            id: Date.now(),
            question: questionData.question,
            options: questionData.options,
            correct: questionData.correct
          };
        }
      }
    } catch (error) {
      console.error('Groq Trivia Error:', error);
    } finally {
      setLoading(false);
    }
    
    // Fallback question
    return getFallbackQuestion();
  };

  const getFallbackQuestion = (): Question => {
    const fallbackQuestions = [
      {
        id: 1,
        question: "Which renewable energy source uses sunlight?",
        options: ["Wind", "Solar", "Hydro", "Geothermal"],
        correct: 1
      },
      {
        id: 2,
        question: "What does the 3R principle stand for?",
        options: ["Reduce, Reuse, Recycle", "Read, Write, Repeat", "Run, Rest, Relax", "Remove, Replace, Repair"],
        correct: 0
      },
      {
        id: 3,
        question: "Which gas is the main cause of global warming?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correct: 2
      }
    ];
    
    return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const loadNewQuestion = async () => {
    const question = await generateQuestion();
    setCurrentQuestion(question);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correct;
    setIsCorrect(correct);
    setAnswered(true);
    setShowResult(true);

    // Award or deduct points
    if (correct) {
      updatePoints(50);
    } else {
      updatePoints(-25);
    }
  };

  const nextQuestion = async () => {
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
    setIsCorrect(false);
    await loadNewQuestion();
  };

  if (!currentQuestion || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="arcade-dialog p-8 text-center">
          <Loader className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <div className="arcade-text arcade-text-cyan">GENERATING ECO QUESTION...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ECO-TRIVIA</h1>
        <p className="arcade-text arcade-text-yellow">TEST YOUR ENVIRONMENTAL KNOWLEDGE</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="arcade-dialog p-4 text-center">
          <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
          <div className="arcade-text arcade-text-cyan text-xs">CURRENT POINTS</div>
          <div className="arcade-h2 arcade-text-yellow">{userProgress.points}</div>
        </div>
        <div className="arcade-dialog p-4 text-center">
          <Award className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="arcade-text arcade-text-cyan text-xs">CORRECT ANSWER</div>
          <div className="arcade-h2 arcade-text-green">+50 PTS</div>
        </div>
        <div className="arcade-dialog p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <div className="arcade-text arcade-text-cyan text-xs">WRONG ANSWER</div>
          <div className="arcade-h2 arcade-text-red">-25 PTS</div>
        </div>
      </div>

      {/* Question */}
      <div className="arcade-dialog p-8">
        <div className="mb-6">
          <h2 className="arcade-h2 arcade-text-cyan mb-4">QUESTION</h2>
          <p className="arcade-text text-lg mb-6">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full p-4 text-left arcade-card cursor-pointer ${
                selectedAnswer === index ? 'arcade-card-yellow' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="arcade-text text-sm">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
                {selectedAnswer === index && (
                  <Check className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Submit/Next Button */}
        <div className="text-center">
          {!answered ? (
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className={`arcade-btn ${
                selectedAnswer !== null ? 'arcade-btn-primary' : 'arcade-btn-secondary'
              } px-8`}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <div>
              {showResult && (
                <div className={`arcade-card p-4 mb-4 ${isCorrect ? 'arcade-card-green' : 'arcade-card-red'}`}>
                  <div className="text-center">
                    {isCorrect ? (
                      <div>
                        <div className="arcade-text arcade-text-green text-lg mb-2">CORRECT! 🎉</div>
                        <div className="arcade-text arcade-text-yellow text-sm">+50 POINTS EARNED</div>
                      </div>
                    ) : (
                      <div>
                        <div className="arcade-text arcade-text-red text-lg mb-2">WRONG! ❌</div>
                        <div className="arcade-text arcade-text-yellow text-sm">-25 POINTS DEDUCTED</div>
                        <div className="arcade-text arcade-text-cyan text-sm mt-2">
                          CORRECT: {String.fromCharCode(65 + currentQuestion.correct)}. {currentQuestion.options[currentQuestion.correct]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={nextQuestion}
                className="arcade-btn arcade-btn-primary px-8"
              >
                <ArrowRight className="w-4 h-4 inline mr-2" />
                NEXT QUESTION
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rules */}
      <div className="mt-8 arcade-dialog p-6">
        <h3 className="arcade-h3 mb-4">GAME RULES</h3>
        <div className="space-y-2">
          <div className="arcade-text arcade-text-cyan text-xs">• Answer correctly to earn +50 points</div>
          <div className="arcade-text arcade-text-cyan text-xs">• Wrong answers deduct -25 points</div>
          <div className="arcade-text arcade-text-cyan text-xs">• You must answer before proceeding</div>
          <div className="arcade-text arcade-text-cyan text-xs">• Questions are randomly selected</div>
        </div>
      </div>
    </div>
  );
}