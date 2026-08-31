import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { EligibilityProvider } from './context/EligibilityContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import Landing from './pages/Landing';
import EligibilityWizard from './pages/EligibilityWizard';
import Results from './pages/Results';
import SchemeDetail from './pages/SchemeDetail';
import Passbook from './pages/Passbook';
import ApplicationsTracker from './pages/ApplicationsTracker';
import ExploreSchemes from './pages/ExploreSchemes';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import FAQPage from './pages/FAQPage';

function AppContent() {
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressEl = document.getElementById('scroll-progress');
      if (progressEl) {
        progressEl.style.width = scrolled + '%';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-paper text-ink font-sans relative">
      <div id="scroll-progress" />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/eligibility" element={<EligibilityWizard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/scheme/:id" element={<SchemeDetail />} />
          <Route path="/passbook" element={<Passbook />} />
          <Route path="/applications" element={<ApplicationsTracker />} />
          <Route path="/explore" element={<ExploreSchemes />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Auth isRegister={false} />} />
          <Route path="/register" element={<Auth isRegister={true} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/schemes" element={<AdminDashboard />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <EligibilityProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </EligibilityProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
