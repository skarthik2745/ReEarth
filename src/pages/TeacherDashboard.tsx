import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, Users, Award, FileText, Camera, MessageSquare } from 'lucide-react';

interface ChallengeSubmission {
  id: string;
  studentName: string;
  challengeTitle: string;
  submissionDate: string;
  proofType: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  files?: string[];
  reflection: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');

  const pendingSubmissions: ChallengeSubmission[] = [
    {
      id: '1',
      studentName: 'Alex Green',
      challengeTitle: 'Sustainability Diary Challenge',
      submissionDate: '2024-01-15',
      proofType: 'multiple',
      status: 'pending',
      points: 150,
      files: ['diary_week1.jpg', 'reusable_items.jpg'],
      reflection: 'This challenge made me realize how many single-use items I use daily. I successfully replaced plastic bags with cloth bags, disposable water bottles with a steel bottle, and plastic straws with bamboo straws. The hardest part was remembering to carry reusables, but it became a habit by day 4.'
    },
    {
      id: '2',
      studentName: 'Emma Earth',
      challengeTitle: 'Plant a Tree Challenge',
      submissionDate: '2024-01-14',
      proofType: 'photo',
      status: 'pending',
      points: 200,
      files: ['tree_planting.jpg', 'tree_after_week.jpg'],
      reflection: 'Planted a neem tree in our school compound. Learned about proper planting techniques and the importance of native species. The tree is showing good growth after one week of care.'
    },
    {
      id: '3',
      studentName: 'Sam Solar',
      challengeTitle: 'Energy Audit Challenge',
      submissionDate: '2024-01-13',
      proofType: 'text',
      status: 'pending',
      points: 175,
      reflection: 'Conducted a home energy audit and identified 5 areas for improvement: LED bulb replacement, unplugging devices, using natural light, efficient cooking methods, and solar water heating. Implemented LED replacement and saved 15% on electricity bill.'
    }
  ];

  const [submissions, setSubmissions] = useState(pendingSubmissions);

  const handleApprove = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'approved' as const } : sub
    ));
  };

  const handleReject = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'rejected' as const } : sub
    ));
  };

  const stats = {
    totalStudents: 156,
    activeSubmissions: submissions.filter(s => s.status === 'pending').length,
    approvedToday: 12,
    totalPointsAwarded: 15420
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="retro-h1 mb-4">
          Welcome, {user?.name}! 👨‍🏫
        </h1>
        <p className="retro-text retro-text-yellow">
          ADMIN CONTROL PANEL - MANAGE PLAYER PROGRESS
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="retro-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">TOTAL PLAYERS</p>
              <p className="retro-h2 text-cyan-400">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-cyan-400 border-2 border-white">
              <Users className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card retro-card-red p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">PENDING REVIEWS</p>
              <p className="retro-h2 text-yellow-400">{stats.activeSubmissions}</p>
            </div>
            <div className="p-3 bg-yellow-400 border-2 border-white">
              <Clock className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card retro-card-magenta p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">APPROVED TODAY</p>
              <p className="retro-h2 text-green-400">{stats.approvedToday}</p>
            </div>
            <div className="p-3 bg-green-400 border-2 border-white">
              <CheckCircle className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="retro-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="retro-text retro-text-yellow text-xs">POINTS AWARDED</p>
              <p className="retro-h2 text-magenta-400">{stats.totalPointsAwarded.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-magenta-400 border-2 border-white">
              <Award className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b-4 border-white">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`retro-btn text-xs px-4 py-2 ${
                activeTab === 'submissions'
                  ? 'retro-btn-cyan'
                  : 'retro-btn-red'
              }`}
            >
              MISSION REPORTS
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`retro-btn text-xs px-4 py-2 ${
                activeTab === 'analytics'
                  ? 'retro-btn-cyan'
                  : 'retro-btn-red'
              }`}
            >
              ANALYTICS
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {submissions.map((submission, index) => {
            const colors = ['arcade-card-cyan', 'arcade-card-magenta', 'arcade-card-green', 'arcade-card-yellow'];
            const colorIndex = index % 4;
            
            return (
              <div key={submission.id} className={`${colors[colorIndex]} p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="arcade-text arcade-text-neon-cyan text-sm">{submission.challengeTitle.toUpperCase()}</h3>
                    <span className={`retro-card px-3 py-1 arcade-text text-xs ${
                      submission.status === 'pending' ? 'bg-yellow-400 text-black' :
                      submission.status === 'approved' ? 'bg-green-400 text-black' :
                      'bg-red-400 text-black'
                    }`}>
                      {submission.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="arcade-text arcade-text-neon-yellow text-xs">
                    SUBMITTED BY <span className="arcade-text-neon-green">{submission.studentName.toUpperCase()}</span> ON {submission.submissionDate.toUpperCase()}
                  </p>
                  <p className="arcade-text arcade-text-neon-pink text-xs mt-1">
                    POINTS: {submission.points} • PROOF TYPE: {submission.proofType.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Files */}
              {submission.files && submission.files.length > 0 && (
                <div className="mb-4">
                  <h4 className="arcade-text arcade-text-neon-cyan text-xs mb-2 flex items-center">
                    <Camera className="h-4 w-4 mr-1" />
                    SUBMITTED FILES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, index) => (
                      <div key={index} className="retro-card p-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        <span className="arcade-text arcade-text-neon-yellow text-xs">{file.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection */}
              <div className="mb-4">
                <h4 className="arcade-text arcade-text-neon-cyan text-xs mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  STUDENT REFLECTION
                </h4>
                <div className="retro-card p-4">
                  <p className="arcade-text arcade-text-neon-yellow text-xs leading-relaxed">{submission.reflection}</p>
                </div>
              </div>

              {/* Actions */}
              {submission.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(submission.id)}
                    className="retro-btn retro-btn-green arcade-text text-xs flex items-center gap-2 px-4 py-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    APPROVE & AWARD POINTS
                  </button>
                  <button
                    onClick={() => handleReject(submission.id)}
                    className="retro-btn retro-btn-red arcade-text text-xs flex items-center gap-2 px-4 py-2"
                  >
                    REQUEST REVISION
                  </button>
                </div>
              )}

              {submission.status === 'approved' && (
                <div className="retro-card retro-card-green p-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="arcade-text arcade-text-neon-green text-xs">APPROVED - {submission.points} POINTS AWARDED</span>
                </div>
              )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="arcade-dialog p-8">
          <h3 className="arcade-text arcade-text-neon-cyan text-lg mb-6">STUDENT PROGRESS ANALYTICS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="retro-card p-6">
              <h4 className="arcade-text arcade-text-neon-yellow text-xs mb-4">CHALLENGE COMPLETION RATES</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="arcade-text arcade-text-neon-green text-xs">SUSTAINABILITY CHALLENGES</span>
                    <span className="arcade-text arcade-text-neon-cyan text-xs">78%</span>
                  </div>
                  <div className="w-full bg-black border-2 border-cyan-400 h-3">
                    <div className="bg-green-400 h-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="arcade-text arcade-text-neon-green text-xs">ENERGY CHALLENGES</span>
                    <span className="arcade-text arcade-text-neon-cyan text-xs">65%</span>
                  </div>
                  <div className="w-full bg-black border-2 border-cyan-400 h-3">
                    <div className="bg-cyan-400 h-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="arcade-text arcade-text-neon-green text-xs">POLLUTION CHALLENGES</span>
                    <span className="arcade-text arcade-text-neon-cyan text-xs">82%</span>
                  </div>
                  <div className="w-full bg-black border-2 border-cyan-400 h-3">
                    <div className="bg-magenta-400 h-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="retro-card p-6">
              <h4 className="arcade-text arcade-text-neon-yellow text-xs mb-4">TOP PERFORMING STUDENTS</h4>
              <div className="space-y-3">
                {[
                  { name: 'Alex Green', points: 1250, challenges: 15 },
                  { name: 'Emma Earth', points: 1180, challenges: 14 },
                  { name: 'Sam Solar', points: 950, challenges: 12 },
                  { name: 'Luna Lake', points: 820, challenges: 10 },
                  { name: 'River Stone', points: 750, challenges: 9 }
                ].map((student, index) => {
                  const colors = ['retro-card-green', 'retro-card-red', 'retro-card-magenta', 'arcade-card-cyan', 'arcade-card-yellow'];
                  return (
                    <div key={index} className={`${colors[index]} p-3 flex items-center justify-between`}>
                      <div>
                        <p className="arcade-text arcade-text-neon-cyan text-xs">{student.name.toUpperCase()}</p>
                        <p className="arcade-text arcade-text-neon-yellow text-xs">{student.challenges} CHALLENGES COMPLETED</p>
                      </div>
                      <div className="text-right">
                        <p className="arcade-text arcade-text-neon-green text-xs">{student.points}</p>
                        <p className="arcade-text arcade-text-neon-pink text-xs">POINTS</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}