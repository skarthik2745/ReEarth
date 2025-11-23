import React, { createContext, useContext, useState } from 'react';

interface Submission {
  id: number;
  challengeId: number;
  challengeTitle: string;
  studentName: string;
  description: string;
  file?: File;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface SubmissionContextType {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => void;
  approveSubmission: (id: number) => void;
  rejectSubmission: (id: number) => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export function useSubmissions() {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error('useSubmissions must be used within a SubmissionProvider');
  }
  return context;
}

export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      challengeId: 1,
      challengeTitle: '7-Day Plastic-Free Week',
      studentName: 'Priya K',
      description: 'Successfully avoided all single-use plastics for 7 days. Used reusable bags, bottles, and containers.',
      submittedAt: new Date('2024-01-20'),
      status: 'pending'
    },
    {
      id: 2,
      challengeId: 2,
      challengeTitle: 'Water Conservation Challenge',
      studentName: 'Arjun S',
      description: 'Reduced daily water usage by 30%. Fixed leaky taps and used bucket for bathing.',
      submittedAt: new Date('2024-01-19'),
      status: 'pending'
    },
    {
      id: 3,
      challengeId: 4,
      challengeTitle: 'Plant a Tree Challenge',
      studentName: 'Meera P',
      description: 'Planted a neem tree in school garden and committed to daily watering for 1 month.',
      submittedAt: new Date('2024-01-18'),
      status: 'pending'
    }
  ]);

  const addSubmission = (submission: Omit<Submission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date(),
      status: 'pending'
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const approveSubmission = (id: number) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' as const } : sub
    ));
  };

  const rejectSubmission = (id: number) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'rejected' as const } : sub
    ));
  };

  return (
    <SubmissionContext.Provider value={{
      submissions,
      addSubmission,
      approveSubmission,
      rejectSubmission
    }}>
      {children}
    </SubmissionContext.Provider>
  );
}