
import React, { useState, useEffect } from 'react';
import { View, Grade, TestType, TestData, StudentResult, UserRole } from './types';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './components/TeacherDashboard';
import TestGenerator from './components/TestGenerator';
import StudentPortal from './components/StudentPortal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RoleSelector from './components/RoleSelector';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [currentView, setCurrentView] = useState<View>(View.TEACHER_DASHBOARD);
  const [activeTest, setActiveTest] = useState<TestData | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);

  // Initialize with some mock data for demo
  useEffect(() => {
    const mockResults: StudentResult[] = [
      { id: '1', studentName: 'Nguyễn Văn A', studentClass: '6A1', score: 8.5, maxScore: 10, submittedAt: new Date().toISOString(), answers: {} },
      { id: '2', studentName: 'Trần Thị B', studentClass: '6A1', score: 4.0, maxScore: 10, submittedAt: new Date().toISOString(), answers: {} },
      { id: '3', studentName: 'Lê Văn C', studentClass: '6A1', score: 9.5, maxScore: 10, submittedAt: new Date().toISOString(), answers: {} },
      { id: '4', studentName: 'Phạm Minh D', studentClass: '6A1', score: 6.5, maxScore: 10, submittedAt: new Date().toISOString(), answers: {} },
    ];
    setResults(mockResults);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.STUDENT) {
      setCurrentView(View.STUDENT_PORTAL);
    } else {
      setCurrentView(View.TEACHER_DASHBOARD);
    }
  };

  const handleTestGenerated = (test: TestData) => {
    setActiveTest(test);
    setCurrentView(View.TEACHER_DASHBOARD);
  };

  const handleStudentSubmit = (result: StudentResult) => {
    setResults(prev => [...prev, result]);
    // Stay in student portal for result view
  };

  const handleLogout = () => {
    setUserRole(UserRole.NONE);
  };

  if (userRole === UserRole.NONE) {
    return <RoleSelector onSelect={handleRoleSelect} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        userRole={userRole} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {userRole === UserRole.TEACHER && (
            <>
              {currentView === View.TEACHER_DASHBOARD && (
                <TeacherDashboard 
                  activeTest={activeTest} 
                  resultsCount={results.length} 
                  onCreateClick={() => setCurrentView(View.CREATE_TEST)}
                />
              )}
              {currentView === View.CREATE_TEST && (
                <TestGenerator onGenerated={handleTestGenerated} />
              )}
              {currentView === View.ANALYTICS && (
                <AnalyticsDashboard results={results} test={activeTest} />
              )}
            </>
          )}

          {currentView === View.STUDENT_PORTAL && (
            <StudentPortal 
              test={activeTest} 
              onSubmit={handleStudentSubmit} 
              results={results}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
