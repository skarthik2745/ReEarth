import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById } from '../data/complete50Lessons';
import { generateEcoChallenges } from '../services/geminiApi';
import { ArrowLeft, Upload, Camera, FileText, CheckCircle, Target, Clock, Award, MapPin, Calendar, Zap, TrendingUp, Star } from 'lucide-react';

export default function EcoChallengeView() {
  const { lessonId } = useParams();
  const { completeChallenge, addPoints } = useGame();
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [gpsLocation, setGpsLocation] = useState('');
  const [dateStamp, setDateStamp] = useState(new Date().toISOString().split('T')[0]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lesson = getLessonById(lessonId!);

  useEffect(() => {
    const loadChallenges = async () => {
      if (lesson) {
        setLoading(true);
        try {
          const generatedChallenges = await generateEcoChallenges(lesson.title, lessonId);
          const challengesWithIds = generatedChallenges.map((challenge, index) => ({
            ...challenge,
            id: `${lessonId}-${challenge.difficulty}`,
            originalId: challenge.id
          }));
          setChallenges(challengesWithIds);
        } catch (error) {
          console.error('Failed to load challenges:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadChallenges();
  }, [lesson, lessonId]);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">Return to Modules</Link>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[selectedChallenge];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if (reflection.length >= 50 && uploadedFiles.length > 0) {
      completeChallenge(currentChallenge.id, currentChallenge.points);
      localStorage.setItem(`challenge_completed_${lessonId}_${currentChallenge.difficulty}`, 'true');
      setSubmitted(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Zap className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'hard': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Eco Challenges...</h2>
          <p className="text-gray-600">Generating personalized action-based challenges for {lesson?.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to={`/lesson/${lesson.id.split('-')[0]}/${lessonId}`} className="inline-flex items-center arcade-text arcade-text-neon-green hover:arcade-text-neon-yellow mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          BACK TO LESSON
        </Link>
        
        <div className="arcade-dialog p-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-green-400 border-4 border-white">
              <Target className="h-8 w-8 text-black" />
            </div>
            <div className="flex-1">
              <h1 className="retro-h1 mb-2">ECO MISSIONS</h1>
              <p className="arcade-text arcade-text-neon-cyan mb-4">COMPLETE REAL-WORLD ENVIRONMENTAL ACTIONS FOR {lesson.title.toUpperCase()}</p>
              <div className="arcade-text arcade-text-neon-yellow text-xs">
                CHOOSE ONE OF THE THREE ACTION-BASED CHALLENGES BELOW TO COMPLETE
              </div>
            </div>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge Selection */}
          <div className="space-y-6">
            <h2 className="arcade-text arcade-text-neon-pink text-lg" style={{textShadow: '2px 2px 0px #ffcc00'}}>AVAILABLE MISSIONS</h2>
            
            {challenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={`eco-mission-card p-6 cursor-pointer ${
                  selectedChallenge === index 
                    ? 'active' 
                    : ''
                }`}
                onClick={() => setSelectedChallenge(index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedChallenge === index 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedChallenge === index && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="arcade-text arcade-text-neon-yellow text-sm">{challenge.title.toUpperCase()}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyIcon(challenge.difficulty)}
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <p className="arcade-text arcade-text-neon-cyan mb-4 text-xs">{challenge.description}</p>

                <div className="grid grid-cols-2 gap-4 arcade-text arcade-text-neon-green text-xs">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                    {(challenge.timeframe || '1-7 DAYS').toUpperCase()}
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-yellow-400" />
                    {challenge.points} POINTS
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-magenta-400" />
                    {(challenge.proofType === 'multiple' ? 'PHOTO/VIDEO' : 'PHOTO')} PROOF
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-green-400" />
                    {(challenge.category || 'ACTION').toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Challenge Details & Submission */}
          <div className="space-y-6">
            <div className="arcade-dialog p-6">
              <h3 className="arcade-text arcade-text-neon-pink text-lg mb-4" style={{textShadow: '2px 2px 0px #ffcc00'}}>MISSION BRIEFING</h3>
              
              <div className="space-y-3 mb-6">
                {currentChallenge.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-400 border-2 border-white flex items-center justify-center">
                      <span className="arcade-text text-black text-xs">{index + 1}</span>
                    </div>
                    <p className="arcade-text arcade-text-neon-cyan text-xs">{instruction.toUpperCase()}</p>
                  </div>
                ))}
              </div>

              {/* Materials Required */}
              <div className="mb-6">
                <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                  MATERIALS REQUIRED
                </label>
                <div className="arcade-card arcade-card-cyan p-3">
                  <ul className="arcade-text arcade-text-neon-green text-xs space-y-1">
                    {currentChallenge.materials.map((material, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 mr-2"></span>
                        {material.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t-4 border-cyan-400 pt-6">
                <h4 className="arcade-text arcade-text-neon-pink text-sm mb-4">SUBMIT YOUR PROOF</h4>
                
                {/* File Upload */}
                <div className="mb-6">
                  <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                    UPLOAD EVIDENCE (PHOTOS/VIDEOS) *
                  </label>
                  <div className="arcade-card arcade-card-magenta p-6 text-center hover:arcade-card-green transition-colors cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                      <p className="arcade-text arcade-text-neon-cyan text-xs">CLICK TO UPLOAD FILES</p>
                      <p className="arcade-text arcade-text-neon-yellow text-xs">IMAGES, VIDEOS UP TO 10MB EACH</p>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="arcade-card arcade-card-green p-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="arcade-text arcade-text-neon-green text-xs">{file.name.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Example Display */}
                <div className="mb-6">
                  <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                    💡 EXAMPLE IDEAS
                  </label>
                  <div className="arcade-card arcade-card-yellow p-4">
                    <p className="arcade-text arcade-text-neon-cyan text-xs mb-2">HOW OTHER STUDENTS COMPLETED THIS:</p>
                    <div className="arcade-text arcade-text-neon-green text-xs space-y-3">
                      <div>
                        <p className="arcade-text arcade-text-neon-yellow text-xs mb-2">💡 EXAMPLE IDEAS:</p>
                        <ul className="space-y-1">
                          {currentChallenge?.exampleIdeas?.map((idea, index) => (
                            <li key={index}>• {idea.toUpperCase()}</li>
                          )) || [
                            'START SMALL AND DOCUMENT YOUR PROGRESS WITH PHOTOS',
                            'INVOLVE FRIENDS OR FAMILY MEMBERS TO MAKE IT MORE FUN',
                            'MEASURE THE IMPACT OF YOUR ACTIONS WITH SIMPLE TOOLS',
                            'SHARE YOUR EXPERIENCE TO INSPIRE OTHERS'
                          ].map((idea, index) => (
                            <li key={index}>• {idea}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {currentChallenge?.example && (
                        <div className="pt-3 border-t-2 border-cyan-400">
                          <p className="arcade-text arcade-text-neon-yellow text-xs mb-2">SUCCESS STORY:</p>
                          <p className="arcade-text arcade-text-neon-cyan text-xs">{currentChallenge.example.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reflection */}
                <div className="mb-6">
                  <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                    WHAT DID YOU LEARN? (50+ WORDS) *
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={4}
                    className="retro-input w-full"
                    placeholder="DESCRIBE WHAT YOU DID, WHAT YOU LEARNED, AND HOW IT IMPACTED YOU..."
                  />
                  <div className="mt-1 arcade-text arcade-text-neon-cyan text-xs">
                    {reflection.length} CHARACTERS (MINIMUM 50 REQUIRED)
                  </div>
                </div>

                {/* Optional Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                      <MapPin className="h-4 w-4 inline mr-1 text-cyan-400" />
                      LOCATION (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={gpsLocation}
                      onChange={(e) => setGpsLocation(e.target.value)}
                      className="retro-input w-full"
                      placeholder="WHERE DID YOU COMPLETE THIS?"
                    />
                  </div>
                  <div>
                    <label className="arcade-text arcade-text-neon-yellow text-xs mb-2 block">
                      <Calendar className="h-4 w-4 inline mr-1 text-magenta-400" />
                      DATE COMPLETED
                    </label>
                    <input
                      type="date"
                      value={dateStamp}
                      onChange={(e) => setDateStamp(e.target.value)}
                      className="retro-input w-full"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={reflection.length < 50 || uploadedFiles.length === 0}
                  className="w-full retro-btn retro-btn-red arcade-text text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SUBMIT MISSION (+{currentChallenge.points} PTS)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Success State */
        <div className="mission-result p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400 border-4 border-white mb-6">
            <CheckCircle className="h-8 w-8 text-black" />
          </div>
          
          <h2 className="arcade-text arcade-text-neon-green text-2xl mb-4">MISSION COMPLETE!</h2>
          <p className="arcade-text arcade-text-neon-cyan mb-6">
            SUCCESS! YOU EARNED {currentChallenge.points} ECOPOINTS FOR "{currentChallenge.title.toUpperCase()}".
          </p>
          
          <div className="eco-mission-card p-4 mb-6">
            <p className="arcade-text arcade-text-neon-green">
              +{currentChallenge.points} ECOPOINTS ADDED TO ACCOUNT!
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to={`/lesson/${lesson.id.split('-')[0]}/${lessonId}`}
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
  );
}