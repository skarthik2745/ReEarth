import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { ArrowLeft, Upload, Camera, FileText, CheckCircle, Target, Clock, Award } from 'lucide-react';

const challenges = [
  {
    id: 'carbon-calculator',
    title: 'Calculate Your Carbon Footprint',
    description: 'Use an online carbon calculator to measure your personal carbon footprint',
    instructions: [
      'Find a reputable online carbon footprint calculator',
      'Input your transportation, energy, and lifestyle data',
      'Take a screenshot of your results',
      'Identify your top 3 emission sources',
      'Write a brief reflection on what surprised you'
    ],
    proofType: 'multiple',
    difficulty: 'easy',
    points: 100,
    timeframe: '3 days',
    category: 'measurement'
  },
  {
    id: 'plant-tree',
    title: 'Plant a Tree',
    description: 'Plant a tree or sapling and document its growth',
    instructions: [
      'Choose an appropriate location for planting',
      'Select a native tree species for your area',
      'Plant the tree following proper techniques',
      'Take before and after photos',
      'Create a care plan for the tree'
    ],
    proofType: 'photo',
    difficulty: 'medium',
    points: 200,
    timeframe: '1 week',
    category: 'action'
  }
];

export default function ChallengeView() {
  const { challengeId } = useParams();
  const { completeChallenge, addPoints } = useGame();
  const [submitted, setSubmitted] = useState(false);
  const [proofText, setProofText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const challenge = challenges.find(c => c.id === challengeId);

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Challenge Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    completeChallenge(challenge.id);
    addPoints(challenge.points);
    localStorage.setItem(`challenge_completed_${challengeId}`, 'true');
    setSubmitted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        
        <div className="flex items-start gap-4">
          <div className="p-4 bg-green-100 rounded-xl">
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-gray-600 text-lg mb-4">{challenge.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {challenge.timeframe}
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {challenge.points} points
              </div>
            </div>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="space-y-8">
          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Instructions</h2>
            <div className="space-y-4">
              {challenge.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Your Proof</h2>
            
            {/* File Upload */}
            {(challenge.proofType === 'photo' || challenge.proofType === 'multiple') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos/Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload files or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Text Submission */}
            {(challenge.proofType === 'text' || challenge.proofType === 'multiple') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description & Reflection
                </label>
                <textarea
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe what you did and what you learned from this challenge..."
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!proofText && uploadedFiles.length === 0}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Challenge
            </button>
          </div>
        </div>
      ) : (
        /* Success State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Completed!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! You've earned {challenge.points} EcoPoints for completing this challenge.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              +{challenge.points} EcoPoints added to your account!
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/leaderboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}