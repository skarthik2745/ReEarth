import React, { useState } from 'react';
import { BarChart3, Users, Trophy, CheckCircle, Clock, Award, TrendingUp, Eye } from 'lucide-react';
import { useSubmissions } from '../contexts/SubmissionContext';
import { useProjects } from '../contexts/ProjectContext';

export default function TeacherAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const { submissions, approveSubmission, rejectSubmission } = useSubmissions();
  const { projectSubmissions, approveProject, rejectProject } = useProjects();
  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const pendingProjects = projectSubmissions.filter(proj => proj.status === 'pending');
  const [awardPoints, setAwardPoints] = useState<{[key: number]: number}>({});
  const [awardProjectPoints, setAwardProjectPoints] = useState<{[key: number]: number}>({});

  const classStats = {
    totalStudents: 32,
    avgLessonsCompleted: 4.2,
    totalChallengesSubmitted: 124,
    totalCarbonSaved: 48,
    bestPerformer: 'Harish P',
    bestPerformerPoints: 880
  };

  const topStudents = [
    { name: 'Harish P', points: 880, lessons: 7, challenges: 15 },
    { name: 'Priya K', points: 540, lessons: 5, challenges: 12 },
    { name: 'Arjun S', points: 420, lessons: 4, challenges: 8 }
  ];

  const pendingApprovals = [
    { type: 'challenge', student: 'Meera P', title: 'Water Conservation Week', submitted: '2 hours ago' },
    { type: 'project', student: 'Karthik M', title: 'Solar Panel Project', submitted: '1 day ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">TEACHER ANALYTICS PANEL</h1>
        <p className="arcade-text arcade-text-yellow">MONITOR • ANALYZE • GUIDE</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="arcade-card p-2 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'students', label: 'STUDENTS' },
            { id: 'challenges', label: 'CHALLENGES' },
            { id: 'projects', label: 'PROJECTS' },
            { id: 'analytics', label: 'ANALYTICS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`arcade-btn text-xs px-4 py-2 ${activeTab === tab.id ? 'arcade-btn-primary' : 'arcade-btn-secondary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Class Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="arcade-dialog p-6 text-center">
              <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <div className="arcade-h2 text-cyan-400 mb-2">{classStats.totalStudents}</div>
              <div className="arcade-text arcade-text-yellow text-xs">TOTAL STUDENTS</div>
            </div>

            <div className="arcade-dialog p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="arcade-h2 text-green-400 mb-2">{classStats.avgLessonsCompleted}</div>
              <div className="arcade-text arcade-text-yellow text-xs">AVG LESSONS</div>
            </div>

            <div className="arcade-dialog p-6 text-center">
              <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <div className="arcade-h2 text-yellow-400 mb-2">{classStats.totalChallengesSubmitted}</div>
              <div className="arcade-text arcade-text-yellow text-xs">CHALLENGES SUBMITTED</div>
            </div>

            <div className="arcade-dialog p-6 text-center">
              <TrendingUp className="w-12 h-12 text-magenta-400 mx-auto mb-4" />
              <div className="arcade-h2 text-magenta-400 mb-2">{classStats.totalCarbonSaved}</div>
              <div className="arcade-text arcade-text-yellow text-xs">KG CO₂ SAVED</div>
            </div>
          </div>

          {/* Top Performers & Pending Approvals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="arcade-dialog p-6">
              <h3 className="arcade-h2 mb-6 text-center">TOP PERFORMERS</h3>
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={index} className="arcade-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 border-2 border-white flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>
                          <span className="arcade-text text-black text-xs">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="arcade-text arcade-text-cyan text-xs">{student.name.toUpperCase()}</div>
                          <div className="arcade-text arcade-text-yellow text-xs">{student.points} POINTS</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="arcade-text arcade-text-green text-xs">{student.lessons}/7 LESSONS</div>
                        <div className="arcade-text arcade-text-magenta text-xs">{student.challenges} CHALLENGES</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="arcade-dialog p-6">
              <h3 className="arcade-h2 mb-6 text-center">PENDING APPROVALS</h3>
              <div className="space-y-4">
                {pendingApprovals.map((item, index) => (
                  <div key={index} className="arcade-card arcade-card-yellow p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="arcade-text arcade-text-yellow text-xs">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <span className="arcade-text arcade-text-cyan text-xs">{item.submitted.toUpperCase()}</span>
                    </div>
                    <div className="arcade-text arcade-text-cyan text-xs mb-2">{item.student.toUpperCase()}</div>
                    <div className="arcade-text text-xs mb-3">{item.title.toUpperCase()}</div>
                    <div className="flex space-x-2">
                      <button className="flex-1 arcade-btn arcade-btn-green text-xs">APPROVE</button>
                      <button className="flex-1 arcade-btn arcade-btn-red text-xs">REJECT</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="arcade-dialog p-6">
          <h3 className="arcade-h2 mb-6 text-center">STUDENT PERFORMANCE</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-left">STUDENT</th>
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-center">POINTS</th>
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-center">LESSONS</th>
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-center">CHALLENGES</th>
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-center">STREAK</th>
                  <th className="arcade-text arcade-text-yellow text-xs p-3 text-center">CARBON SAVED</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="arcade-text arcade-text-cyan text-xs p-3">{student.name.toUpperCase()}</td>
                    <td className="arcade-text text-xs p-3 text-center">{student.points}</td>
                    <td className="arcade-text text-xs p-3 text-center">{student.lessons}/7</td>
                    <td className="arcade-text text-xs p-3 text-center">{student.challenges}</td>
                    <td className="arcade-text text-xs p-3 text-center">5 DAYS</td>
                    <td className="arcade-text text-xs p-3 text-center">2.1 KG</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-8">
          {/* All Challenges Overview */}
          <div>
            <h3 className="arcade-h2 mb-6 text-center">ALL ACTIVE CHALLENGES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { id: 1, title: '7-Day Plastic-Free Week', creator: 'Arjun S', category: 'Waste Reduction', participants: 48, duration: '7 days', points: 100, submissions: 12 },
                { id: 2, title: 'Water Conservation Challenge', creator: 'Meera P', category: 'Water', participants: 32, duration: '3 days', points: 75, submissions: 8 },
                { id: 3, title: 'Solar Power Week', creator: 'Karthik M', category: 'Energy', participants: 25, duration: '5 days', points: 120, submissions: 5 },
                { id: 4, title: 'Plant a Tree Challenge', creator: 'Priya K', category: 'Nature', participants: 67, duration: '1 day', points: 50, submissions: 23 },
                { id: 5, title: 'Recycling Marathon', creator: 'Harish P', category: 'Recycling', participants: 41, duration: '2 weeks', points: 150, submissions: 15 },
                { id: 6, title: 'Zero Waste Lunch', creator: 'Nivetha R', category: 'Waste', participants: 29, duration: '1 week', points: 80, submissions: 11 }
              ].map(challenge => {
                const challengeSubmissions = submissions.filter(sub => sub.challengeId === challenge.id).length;
                return (
                <div key={challenge.id} className="arcade-dialog p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="arcade-card arcade-card-cyan text-xs px-2 py-1">ACTIVE</span>
                    <span className="arcade-text arcade-text-yellow text-xs">{challenge.points} PTS</span>
                  </div>
                  
                  <h4 className="arcade-h3 mb-2">{challenge.title.toUpperCase()}</h4>
                  <p className="arcade-text arcade-text-cyan text-xs mb-4">BY {challenge.creator.toUpperCase()}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">CATEGORY:</span>
                      <span className="arcade-text-green">{challenge.category.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">PARTICIPANTS:</span>
                      <span className="arcade-text-cyan">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">SUBMISSIONS:</span>
                      <span className="arcade-text-magenta">{challengeSubmissions}</span>
                    </div>
                    <div className="flex items-center justify-between arcade-text text-xs">
                      <span className="arcade-text-yellow">DURATION:</span>
                      <span className="arcade-text-green">{challenge.duration.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="arcade-card p-2 text-center">
                    <span className="arcade-text arcade-text-cyan text-xs">
                      {challengeSubmissions > 0 ? Math.round((challengeSubmissions / challenge.participants) * 100) : 0}% COMPLETION RATE
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Pending Submissions */}
          <div>
            <h3 className="arcade-h2 mb-6 text-center">PENDING SUBMISSIONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="arcade-card arcade-card-yellow text-xs px-2 py-1">PENDING REVIEW</span>
                  <span className="arcade-text arcade-text-cyan text-xs">{submission.submittedAt.toLocaleDateString().toUpperCase()}</span>
                </div>
                
                <h3 className="arcade-h3 mb-2">{submission.challengeTitle.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-cyan text-xs mb-4">BY {submission.studentName.toUpperCase()}</p>
                
                <div className="space-y-3">
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-xs mb-2">DESCRIPTION:</div>
                    <div className="arcade-text arcade-text-cyan text-xs">{submission.description.toUpperCase()}</div>
                  </div>
                  
                  {submission.file && (
                    <div className="arcade-card p-3">
                      <div className="arcade-text arcade-text-yellow text-xs mb-2">PROOF ATTACHED:</div>
                      <div className="arcade-text arcade-text-green text-xs">{submission.file.name}</div>
                    </div>
                  )}
                  
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-xs mb-2">AWARD POINTS:</div>
                    <input 
                      type="number" 
                      value={awardPoints[submission.id] || ''}
                      onChange={(e) => setAwardPoints({...awardPoints, [submission.id]: Number(e.target.value)})}
                      className="arcade-input w-full px-2 py-1 text-xs" 
                      placeholder="ENTER POINTS"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        const points = awardPoints[submission.id] || 0;
                        if (points > 0) {
                          approveSubmission(submission.id);
                          // Here you could also add points to student's account
                          console.log(`Awarded ${points} points to ${submission.studentName}`);
                        } else {
                          alert('Please enter points to award');
                        }
                      }}
                      className="flex-1 arcade-btn arcade-btn-green"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      APPROVE & AWARD
                    </button>
                    <button 
                      onClick={() => rejectSubmission(submission.id)}
                      className="flex-1 arcade-btn arcade-btn-red"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingSubmissions.length === 0 && (
              <div className="col-span-2 text-center arcade-dialog p-8">
                <Clock className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="arcade-h3 mb-2">NO PENDING SUBMISSIONS</h3>
                <p className="arcade-text arcade-text-cyan">ALL CHALLENGES HAVE BEEN REVIEWED</p>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <h3 className="arcade-h2 mb-6 text-center">PENDING PROJECT SUBMISSIONS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingProjects.map((project) => (
              <div key={project.id} className="arcade-dialog p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="arcade-card arcade-card-yellow text-xs px-2 py-1">PENDING REVIEW</span>
                  <span className="arcade-text arcade-text-cyan text-xs">{project.submittedAt.toLocaleDateString().toUpperCase()}</span>
                </div>
                
                <h3 className="arcade-h3 mb-2">{project.title.toUpperCase()}</h3>
                <p className="arcade-text arcade-text-cyan text-xs mb-4">BY {project.studentName.toUpperCase()}</p>
                
                <div className="space-y-3">
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-xs mb-2">CATEGORY:</div>
                    <div className="arcade-text arcade-text-green text-xs">{project.category.toUpperCase()}</div>
                  </div>
                  
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-xs mb-2">SUMMARY:</div>
                    <div className="arcade-text arcade-text-cyan text-xs">{project.summary.toUpperCase()}</div>
                  </div>
                  
                  {project.file && (
                    <div className="arcade-card p-3">
                      <div className="arcade-text arcade-text-yellow text-xs mb-2">FILES ATTACHED:</div>
                      <div className="arcade-text arcade-text-green text-xs">{project.file.name}</div>
                    </div>
                  )}
                  
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-xs mb-2">AWARD POINTS:</div>
                    <input 
                      type="number" 
                      value={awardProjectPoints[project.id] || ''}
                      onChange={(e) => setAwardProjectPoints({...awardProjectPoints, [project.id]: Number(e.target.value)})}
                      className="arcade-input w-full px-2 py-1 text-xs" 
                      placeholder="ENTER POINTS"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        const points = awardProjectPoints[project.id] || 0;
                        if (points > 0) {
                          approveProject(project.id);
                          console.log(`Awarded ${points} points to ${project.studentName} for project`);
                        } else {
                          alert('Please enter points to award');
                        }
                      }}
                      className="flex-1 arcade-btn arcade-btn-green"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      APPROVE & AWARD
                    </button>
                    <button 
                      onClick={() => rejectProject(project.id)}
                      className="flex-1 arcade-btn arcade-btn-red"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingProjects.length === 0 && (
              <div className="col-span-2 text-center arcade-dialog p-8">
                <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="arcade-h3 mb-2">NO PENDING PROJECTS</h3>
                <p className="arcade-text arcade-text-cyan">ALL PROJECTS HAVE BEEN REVIEWED</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="arcade-dialog p-6">
              <h3 className="arcade-h2 mb-6 text-center">WEEKLY ACTIVITY</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="arcade-text arcade-text-yellow text-xs">LESSONS COMPLETED:</span>
                  <span className="arcade-text arcade-text-cyan text-xs">28 THIS WEEK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="arcade-text arcade-text-yellow text-xs">CHALLENGES SUBMITTED:</span>
                  <span className="arcade-text arcade-text-green text-xs">15 THIS WEEK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="arcade-text arcade-text-yellow text-xs">PROJECTS SUBMITTED:</span>
                  <span className="arcade-text arcade-text-magenta text-xs">3 THIS WEEK</span>
                </div>
              </div>
            </div>

            <div className="arcade-dialog p-6">
              <h3 className="arcade-h2 mb-6 text-center">POPULAR CATEGORIES</h3>
              <div className="space-y-3">
                <div className="arcade-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="arcade-text arcade-text-cyan text-xs">WASTE REDUCTION</span>
                    <span className="arcade-text arcade-text-yellow text-xs">45%</span>
                  </div>
                </div>
                <div className="arcade-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="arcade-text arcade-text-cyan text-xs">ENERGY SAVING</span>
                    <span className="arcade-text arcade-text-yellow text-xs">30%</span>
                  </div>
                </div>
                <div className="arcade-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="arcade-text arcade-text-cyan text-xs">WATER CONSERVATION</span>
                    <span className="arcade-text arcade-text-yellow text-xs">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}