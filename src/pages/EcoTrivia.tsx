import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Brain, Award, AlertCircle, ArrowRight, Check } from 'lucide-react';

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

  const questions: Question[] = [
    {
      id: 1,
      question: "Which of the following is a renewable source of energy?",
      options: ["Coal", "Petroleum", "Solar energy", "Natural gas"],
      correct: 2
    },
    {
      id: 2,
      question: "What is the best way to reduce plastic waste?",
      options: ["Burn it", "Reuse and recycle", "Throw it in a river", "Mix it with soil"],
      correct: 1
    },
    {
      id: 3,
      question: "Which gas is mainly responsible for global warming?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
      correct: 2
    },
    {
      id: 4,
      question: "What is the term for planting trees to restore forests?",
      options: ["Deforestation", "Afforestation", "Mining", "Irrigation"],
      correct: 1
    },
    {
      id: 5,
      question: "Which activity saves the most water at home?",
      options: ["Taking long showers", "Keeping taps open", "Fixing leaks", "Washing cars daily"],
      correct: 2
    },
    {
      id: 6,
      question: "Which of these is biodegradable?",
      options: ["Plastic bottle", "Aluminum can", "Banana peel", "Glass jar"],
      correct: 2
    },
    {
      id: 7,
      question: "The 3R principle stands for—",
      options: ["Reduce, Reuse, Recycle", "Read, Rewrite, Respond", "Remove, Replace, Repair", "Reduce, Relieve, Restore"],
      correct: 0
    },
    {
      id: 8,
      question: "Which of these actions helps save electricity?",
      options: ["Leaving lights ON", "Using LED bulbs", "Running AC with open windows", "Using old appliances"],
      correct: 1
    },
    {
      id: 9,
      question: "What is compost made from?",
      options: ["Plastic waste", "Organic waste", "Metals", "E-waste"],
      correct: 1
    },
    {
      id: 10,
      question: "What is the main cause of ocean pollution?",
      options: ["Stars", "Plastic waste", "Clouds", "Sand"],
      correct: 1
    },
    {
      id: 11,
      question: "What do solar panels convert?",
      options: ["Heat to electricity", "Water to oxygen", "Sunlight to electricity", "Air to energy"],
      correct: 2
    },
    {
      id: 12,
      question: "Which of these helps reduce carbon footprint?",
      options: ["Using public transport", "Burning waste", "Using diesel vehicles", "Buying more plastic items"],
      correct: 0
    },
    {
      id: 13,
      question: "What is the best way to dispose of e-waste?",
      options: ["Throw it in dustbin", "Burn it", "Give to certified recyclers", "Dump in open land"],
      correct: 2
    },
    {
      id: 14,
      question: "Which tree is known for high oxygen release?",
      options: ["Neem", "Palm", "Teak", "Coconut"],
      correct: 0
    },
    {
      id: 15,
      question: "What is rainwater harvesting used for?",
      options: ["Storing rainwater for future use", "Cleaning leaves", "Cooling air", "Producing electricity"],
      correct: 0
    },
    {
      id: 16,
      question: "What does 'carbon footprint' mean?",
      options: ["Footprint made of carbon", "Total greenhouse gases produced by activities", "Foot size", "Amount of diamonds found"],
      correct: 1
    },
    {
      id: 17,
      question: "Which habit reduces paper waste?",
      options: ["Printing everything", "Using both sides of paper", "Throwing books", "Tearing pages"],
      correct: 1
    },
    {
      id: 18,
      question: "What is the main benefit of recycling?",
      options: ["Increases pollution", "Saves natural resources", "Creates more waste", "Wastes energy"],
      correct: 1
    },
    {
      id: 19,
      question: "Which ecosystem absorbs CO₂ naturally?",
      options: ["Deserts", "Forests", "Parking lots", "Roads"],
      correct: 1
    },
    {
      id: 20,
      question: "Which of these is an example of sustainable transport?",
      options: ["Cycling", "Using diesel cars", "Riding alone in big cars", "Using diesel generators"],
      correct: 0
    }
  ];

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  useEffect(() => {
    setCurrentQuestion(getRandomQuestion());
  }, []);

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

  const nextQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
    setSelectedAnswer(null);
    setAnswered(false);
    setShowResult(false);
    setIsCorrect(false);
  };

  if (!currentQuestion) {
    return <div className="arcade-dialog p-8 text-center">Loading...</div>;
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