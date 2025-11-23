import React, { createContext, useContext, useState } from 'react';

interface ProjectSubmission {
  id: number;
  title: string;
  category: string;
  summary: string;
  studentName: string;
  file?: File;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface ProjectContextType {
  projectSubmissions: ProjectSubmission[];
  addProjectSubmission: (submission: Omit<ProjectSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  approveProject: (id: number) => void;
  rejectProject: (id: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectProvider');
  }
  return context;
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmission[]>([
    {
      id: 1,
      title: 'Solar-Powered Classroom Fan',
      category: 'Renewable Energy',
      summary: 'Installed a small panel to run a DC fan reducing electricity consumption',
      studentName: 'Nivetha R',
      submittedAt: new Date('2024-01-20'),
      status: 'pending'
    },
    {
      id: 2,
      title: 'Rainwater Harvesting System',
      category: 'Water Conservation',
      summary: 'Built a mini rainwater collection system for school garden',
      studentName: 'Karthik M',
      submittedAt: new Date('2024-01-19'),
      status: 'pending'
    }
  ]);

  const addProjectSubmission = (submission: Omit<ProjectSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSubmission: ProjectSubmission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date(),
      status: 'pending'
    };
    setProjectSubmissions(prev => [...prev, newSubmission]);
  };

  const approveProject = (id: number) => {
    setProjectSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'approved' as const } : sub
    ));
  };

  const rejectProject = (id: number) => {
    setProjectSubmissions(prev => prev.map(sub => 
      sub.id === id ? { ...sub, status: 'rejected' as const } : sub
    ));
  };

  return (
    <ProjectContext.Provider value={{
      projectSubmissions,
      addProjectSubmission,
      approveProject,
      rejectProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}