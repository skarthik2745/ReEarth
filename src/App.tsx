import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { SubmissionProvider } from './contexts/SubmissionContext';
import { ProjectProvider } from './contexts/ProjectContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import EnhancedLessonView from './pages/EnhancedLessonView';
import ModulesView from './pages/ModulesView';
import EcoChallengeView from './pages/EcoChallengeView';
import QuizView from './pages/QuizView';
import ChallengeView from './pages/ChallengeView';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import ChallengeMarketplace from './pages/ChallengeMarketplace';
import ProjectHub from './pages/ProjectHub';
import VirtualForest from './pages/VirtualForest';
import CarbonCalculator from './pages/CarbonCalculator';
import TeacherAnalytics from './pages/TeacherAnalytics';
import DiscussionForum from './pages/DiscussionForum';
import StoriesSection from './pages/StoriesSection';
import EventManagement from './pages/EventManagement';
import EcoTrivia from './pages/EcoTrivia';
import EcoGames from './pages/EcoGames';

import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'student' | 'teacher' }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'student' ? '/dashboard' : '/teacher'} />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black pixel-bg">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role="student">
              <ModulesView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson/:moduleId/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <EnhancedLessonView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz/:moduleId/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <QuizView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/eco-challenge/:lessonId" 
          element={
            <ProtectedRoute role="student">
              <EcoChallengeView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/challenge/:challengeId" 
          element={
            <ProtectedRoute>
              <ChallengeView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leaderboard" 
          element={
            <ProtectedRoute role="student">
              <Leaderboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/challenges" 
          element={
            <ProtectedRoute role="student">
              <ChallengeMarketplace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute role="student">
              <ProjectHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forest" 
          element={
            <ProtectedRoute role="student">
              <VirtualForest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calculator" 
          element={
            <ProtectedRoute role="student">
              <CarbonCalculator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher-analytics" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherAnalytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forum" 
          element={
            <ProtectedRoute>
              <DiscussionForum />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stories" 
          element={
            <ProtectedRoute>
              <StoriesSection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <EventManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trivia" 
          element={
            <ProtectedRoute role="student">
              <EcoTrivia />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/games" 
          element={
            <ProtectedRoute role="student">
              <EcoGames />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <SubmissionProvider>
            <ProjectProvider>
              <AppRoutes />
            </ProjectProvider>
          </SubmissionProvider>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;