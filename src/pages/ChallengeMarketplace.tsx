import React, { useState } from 'react';
import { Plus, Users, Clock, Camera, CheckCircle, Star } from 'lucide-react';
import { useSubmissions } from '../contexts/SubmissionContext';
import { useAuth } from '../contexts/AuthContext';

export default function ChallengeMarketplace() {
  const [activeTab, setActiveTab] = useState('browse');
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([]);
  const [submittedChallenges, setSubmittedChallenges] = useState<number[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [createdChallenges, setCreatedChallenges] = useState<any[]>([]);
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addSubmission } = useSubmissions();
  const { user } = useAuth();

  const challenges = [
    {
      id: 1,
      title: '7-Day Plastic-Free Week',
      creator: 'Arjun S',
      category: 'Waste Reduction',
      participants: 48,
      duration: '7 days',
      points: 100,
      proofType: 'photo',
      description: 'Avoid single-use plastics for a full week',
      rules: '1. No plastic bags 2. Use reusable bottles 3. Avoid packaged food 4. Document daily progress',
      status: 'ongoing'
    },
    {
      id: 2,
      title: 'Water Conservation Challenge',
      creator: 'Meera P',
      category: 'Water',
      participants: 32,
      duration: '3 days',
      points: 75,
      proofType: 'text',
      description: 'Track and reduce daily water usage',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Solar Power Week',
      creator: 'Karthik M',
      category: 'Energy',
      participants: 25,
      duration: '5 days',
      points: 120,
      proofType: 'photo',
      description: 'Use solar energy for daily activities',
      status: 'ongoing'
    },
    {
      id: 4,
      title: 'Plant a Tree Challenge',
      creator: 'Priya K',
      category: 'Nature',
      participants: 67,
      duration: '1 day',
      points: 50,
      proofType: 'photo',
      description: 'Plant and care for a new tree',
      status: 'ongoing'
    },
    {
      id: 5,
      title: 'Recycling Marathon',
      creator: 'Harish P',
      category: 'Recycling',
      participants: 41,
      duration: '2 weeks',
      points: 150,
      proofType: 'video',
      description: 'Collect and recycle maximum waste',
      status: 'ongoing'
    },
    {
      id: 6,
      title: 'Zero Waste Lunch',
      creator: 'Nivetha R',
      category: 'Waste',
      participants: 29,
      duration: '1 week',
      points: 80,
      proofType: 'photo',
      description: 'Bring waste-free lunch every day',
      status: 'completed'
    }
  ];

  const categories = ['All', 'Waste', 'Water', 'Energy', 'Nature', 'Recycling'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ECO CHALLENGE MARKETPLACE</h1>
        <p className="arcade-text arcade-text-yellow">CREATE • JOIN • COMPLETE CHALLENGES</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="arcade-card p-2 flex space-x-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'browse' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            BROWSE
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'create' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            CREATE
          </button>
          <button
            onClick={() => setActiveTab('my-challenges')}
            className={`arcade-btn text-xs px-4 py-2 ${activeTab === 'my-challenges' ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
          >
            MY CHALLENGES
          </button>
        </div>
      </div>

      {/* Browse Challenges */}
      {activeTab === 'browse' && (
        <div>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map(category => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                  className={`arcade-btn text-xs px-3 py-1 ${
                    selectedCategory === category ? 'arcade-btn-primary' : 'arcade-btn-secondary'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Challenge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...challenges, ...createdChallenges]
              .filter(challenge => selectedCategory === 'All' || challenge.category === selectedCategory)
              .map(challenge => (
              <div key={challenge.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`arcade-card text-xs px-2 py-1 ${challenge.status === 'ongoing' ? 'arcade-card-green' : 'arcade-card-magenta'}`}>
                    {challenge.status.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="arcade-text arcade-text-yellow text-xs">{challenge.points} PTS</span>
                  </div>
                </div>

                <h3 className="arcade-h3 mb-2">{challenge.title.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-cyan text-xs mb-3">{challenge.description.toUpperCase()}</p>
                
                {challenge.rules && (
                  <div className="arcade-card p-2 mb-4">
                    <div className="arcade-text arcade-text-yellow text-xs mb-1">RULES:</div>
                    <div className="arcade-text text-xs">{challenge.rules.toUpperCase()}</div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">CREATOR:</span>
                    <span className="arcade-text-cyan">{challenge.creator.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">CATEGORY:</span>
                    <span className="arcade-text-green">{challenge.category.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between arcade-text text-xs">
                    <span className="arcade-text-yellow">DURATION:</span>
                    <span className="arcade-text-magenta">{challenge.duration.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="arcade-text arcade-text-cyan text-xs">{challenge.participants}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4 text-yellow-400" />
                    <span className="arcade-text arcade-text-yellow text-xs">{challenge.proofType.toUpperCase()}</span>
                  </div>
                </div>

                {!joinedChallenges.includes(challenge.id) ? (
                  <button 
                    onClick={() => setJoinedChallenges([...joinedChallenges, challenge.id])}
                    className="w-full arcade-btn arcade-btn-primary"
                  >
                    JOIN CHALLENGE
                  </button>
                ) : submittedChallenges.includes(challenge.id) ? (
                  <button className="w-full arcade-btn arcade-btn-green" disabled>
                    SUBMITTED ✓
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowSubmissionModal(challenge.id)}
                    className="w-full arcade-btn arcade-btn-yellow"
                  >
                    SUBMIT PROOF
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Challenge */}
      {activeTab === 'create' && (
        <div className="max-w-2xl mx-auto">
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-6 text-center">CREATE NEW CHALLENGE</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CHALLENGE TITLE</label>
                <input name="title" className="arcade-input w-full px-3" placeholder="ENTER TITLE" required />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">DESCRIPTION</label>
                <textarea name="description" className="arcade-input w-full px-3 h-20" placeholder="DESCRIBE YOUR CHALLENGE" required></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">CATEGORY</label>
                  <select name="category" className="arcade-input w-full px-3">
                    <option>WASTE</option>
                    <option>WATER</option>
                    <option>ENERGY</option>
                    <option>NATURE</option>
                    <option>RECYCLING</option>
                  </select>
                </div>

                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">DURATION</label>
                  <select name="duration" className="arcade-input w-full px-3">
                    <option>1 DAY</option>
                    <option>3 DAYS</option>
                    <option>1 WEEK</option>
                    <option>2 WEEKS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">POINTS REWARD</label>
                  <input name="points" type="number" className="arcade-input w-full px-3" placeholder="50" required />
                </div>

                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">PROOF TYPE</label>
                  <select name="proofType" className="arcade-input w-full px-3">
                    <option>PHOTO</option>
                    <option>TEXT</option>
                    <option>VIDEO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">RULES & INSTRUCTIONS</label>
                <textarea name="rules" className="arcade-input w-full px-3 h-24" placeholder="LIST THE RULES AND WHAT PARTICIPANTS NEED TO DO" required></textarea>
              </div>

              <button 
                type="submit" 
                onClick={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget.form!);
                  const newChallenge = {
                    id: Date.now(),
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    category: formData.get('category') as string,
                    duration: formData.get('duration') as string,
                    points: Number(formData.get('points')),
                    proofType: formData.get('proofType') as string,
                    rules: formData.get('rules') as string,
                    creator: user?.name || 'Unknown',
                    participants: 0,
                    status: 'ongoing'
                  };
                  setCreatedChallenges([...createdChallenges, newChallenge]);
                  e.currentTarget.form?.reset();
                }}
                className="w-full arcade-btn arcade-btn-primary"
              >
                CREATE CHALLENGE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* My Challenges */}
      {activeTab === 'my-challenges' && (
        <div>
          {createdChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdChallenges.map(challenge => (
                <div key={challenge.id} className="arcade-dialog p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="arcade-card arcade-card-green text-xs px-2 py-1">MY CHALLENGE</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="arcade-text arcade-text-yellow text-xs">{challenge.points} PTS</span>
                    </div>
                  </div>

                  <h3 className="arcade-h3 mb-2">{challenge.title.toUpperCase()}</h3>
                  <p className="arcade-text arcade-text-cyan text-xs mb-4">{challenge.description.toUpperCase()}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">CATEGORY:</span>
                      <span className="arcade-text-green">{challenge.category}</span>
                    </div>
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">DURATION:</span>
                      <span className="arcade-text-magenta">{challenge.duration}</span>
                    </div>
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">PARTICIPANTS:</span>
                      <span className="arcade-text-cyan">{challenge.participants}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setEditingChallenge(challenge)}
                      className="flex-1 arcade-btn arcade-btn-secondary text-xs"
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('DELETE THIS CHALLENGE?')) {
                          setCreatedChallenges(createdChallenges.filter(c => c.id !== challenge.id));
                        }
                      }}
                      className="flex-1 arcade-btn arcade-btn-red text-xs"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="arcade-dialog p-8">
                <Plus className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="arcade-h3 mb-4">NO CHALLENGES YET</h3>
                <p className="arcade-text arcade-text-cyan mb-6">CREATE YOUR FIRST CHALLENGE TO GET STARTED</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="arcade-btn arcade-btn-primary"
                >
                  CREATE CHALLENGE
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowSubmissionModal(null)}>
          <div className="arcade-dialog p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="arcade-h3 mb-4 text-center">SUBMIT PROOF</h3>
            <div className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">DESCRIPTION</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="arcade-input w-full px-3 h-20" 
                  placeholder="DESCRIBE YOUR COMPLETION"
                ></textarea>
              </div>
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">UPLOAD PROOF</label>
                {uploadedFile ? (
                  <div className="arcade-card p-4">
                    <img 
                      src={URL.createObjectURL(uploadedFile)} 
                      alt="Uploaded proof" 
                      className="w-full h-32 object-cover border-2 border-white mb-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="arcade-text arcade-text-green text-xs">{uploadedFile.name}</span>
                      <button 
                        onClick={() => setUploadedFile(null)}
                        className="arcade-btn arcade-btn-red text-xs px-2 py-1"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="arcade-card p-4 border-2 border-dashed border-cyan-400 cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <p className="arcade-text arcade-text-cyan text-xs">CLICK TO UPLOAD PHOTO/VIDEO</p>
                    </div>
                  </div>
                )}
                <input 
                  id="fileInput" 
                  type="file" 
                  accept="image/*,video/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                    }
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    if (showSubmissionModal && user) {
                      const challenge = challenges.find(c => c.id === showSubmissionModal);
                      if (challenge) {
                        addSubmission({
                          challengeId: challenge.id,
                          challengeTitle: challenge.title,
                          studentName: user.name,
                          description,
                          file: uploadedFile || undefined
                        });
                        setSubmittedChallenges([...submittedChallenges, showSubmissionModal]);
                      }
                    }
                    setShowSubmissionModal(null);
                    setDescription('');
                    setUploadedFile(null);
                  }}
                  className="flex-1 arcade-btn arcade-btn-primary"
                >
                  SUBMIT
                </button>
                <button 
                  onClick={() => {
                    setShowSubmissionModal(null);
                    setUploadedFile(null);
                    setDescription('');
                  }}
                  className="flex-1 arcade-btn arcade-btn-secondary"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Challenge Modal */}
      {editingChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setEditingChallenge(null)}>
          <div className="arcade-dialog p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="arcade-h3 mb-4 text-center">EDIT CHALLENGE</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">CHALLENGE TITLE</label>
                <input 
                  defaultValue={editingChallenge.title}
                  name="title" 
                  className="arcade-input w-full px-3" 
                  required 
                />
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">DESCRIPTION</label>
                <textarea 
                  defaultValue={editingChallenge.description}
                  name="description" 
                  className="arcade-input w-full px-3 h-20" 
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">CATEGORY</label>
                  <select defaultValue={editingChallenge.category} name="category" className="arcade-input w-full px-3">
                    <option>WASTE</option>
                    <option>WATER</option>
                    <option>ENERGY</option>
                    <option>NATURE</option>
                    <option>RECYCLING</option>
                  </select>
                </div>

                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">DURATION</label>
                  <select defaultValue={editingChallenge.duration} name="duration" className="arcade-input w-full px-3">
                    <option>1 DAY</option>
                    <option>3 DAYS</option>
                    <option>1 WEEK</option>
                    <option>2 WEEKS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">POINTS REWARD</label>
                  <input 
                    defaultValue={editingChallenge.points}
                    name="points" 
                    type="number" 
                    className="arcade-input w-full px-3" 
                    required 
                  />
                </div>

                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">PROOF TYPE</label>
                  <select defaultValue={editingChallenge.proofType} name="proofType" className="arcade-input w-full px-3">
                    <option>PHOTO</option>
                    <option>TEXT</option>
                    <option>VIDEO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">RULES & INSTRUCTIONS</label>
                <textarea 
                  defaultValue={editingChallenge.rules}
                  name="rules" 
                  className="arcade-input w-full px-3 h-24" 
                  required
                ></textarea>
              </div>

              <div className="flex space-x-2">
                <button 
                  type="submit" 
                  onClick={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget.form!);
                    const updatedChallenge = {
                      ...editingChallenge,
                      title: formData.get('title') as string,
                      description: formData.get('description') as string,
                      category: formData.get('category') as string,
                      duration: formData.get('duration') as string,
                      points: Number(formData.get('points')),
                      proofType: formData.get('proofType') as string,
                      rules: formData.get('rules') as string
                    };
                    setCreatedChallenges(createdChallenges.map(c => 
                      c.id === editingChallenge.id ? updatedChallenge : c
                    ));
                    setEditingChallenge(null);
                  }}
                  className="flex-1 arcade-btn arcade-btn-primary"
                >
                  UPDATE CHALLENGE
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingChallenge(null)}
                  className="flex-1 arcade-btn arcade-btn-secondary"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}