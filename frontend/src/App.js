import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Eye, Brain, Shield, Users, Upload, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import axios from "axios";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useTranslation } from "./translations";
import { LanguageToggle } from "./components/LanguageToggle";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Landing Page Component
const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.origin + '/profile');
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative">
      {/* Parallax Eye Background */}
      <div 
        className="fixed inset-0 opacity-15 transition-all duration-1000 ease-out pointer-events-none"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1705071393219-7c0c65afa314?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxpcmlzJTIwZXllfGVufDB8fHx8MTc1NzAxMDk1M3ww&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: `${50 + (mousePosition.x - 50) * 0.05}% ${50 + (mousePosition.y - 50) * 0.05}%`,
          filter: 'blur(1px)',
        }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-950/50 via-slate-900/70 to-slate-800/50 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              CornealAI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">{t('features')}</a>
            <a href="#technology" className="text-slate-300 hover:text-white transition-colors">{t('technology')}</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">{t('contact')}</a>
            <LanguageToggle />
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('loginSignup')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-slate-300 hover:text-white">{t('features')}</a>
              <a href="#technology" className="block text-slate-300 hover:text-white">{t('technology')}</a>
              <a href="#contact" className="block text-slate-300 hover:text-white">{t('contact')}</a>
              <div className="flex justify-center">
                <LanguageToggle />
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                {t('loginSignup')}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 mb-6">
              {t('revolutionaryTech')}
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
              {t('discoverDisease')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t('throughYourEyes')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('heroDescription')}
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              {t('startAnalysis')}
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
            >
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {t('advancedPlatform')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {t('platformDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{t('adminControl')}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">{t('adminDescription')}</p>
                <ul className="space-y-2 text-sm">
                  <li>• {t('adminFeatures.0')}</li>
                  <li>• {t('adminFeatures.1')}</li>
                  <li>• {t('adminFeatures.2')}</li>
                  <li>• {t('adminFeatures.3')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Collaborator Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{t('collaboratorAccess')}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">{t('collaboratorDescription')}</p>
                <ul className="space-y-2 text-sm">
                  <li>• {t('collaboratorFeatures.0')}</li>
                  <li>• {t('collaboratorFeatures.1')}</li>
                  <li>• {t('collaboratorFeatures.2')}</li>
                  <li>• {t('collaboratorFeatures.3')}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Scientist Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">{t('scientistReview')}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">{t('scientistDescription')}</p>
                <ul className="space-y-2 text-sm">
                  <li>• {t('scientistFeatures.0')}</li>
                  <li>• {t('scientistFeatures.1')}</li>
                  <li>• {t('scientistFeatures.2')}</li>
                  <li>• {t('scientistFeatures.3')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t('cuttingEdgeAI')}
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {t('technologyDescription')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('monaiIntegration')}</h3>
                    <p className="text-slate-400">{t('monaiDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('hipaaCompliant')}</h3>
                    <p className="text-slate-400">{t('hipaaDescription')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('collaborativeWorkflow')}</h3>
                    <p className="text-slate-400">{t('workflowDescription')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                <img 
                  src="https://images.unsplash.com/photo-1483519173755-be893fab1f46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxodW1hbiUyMGV5ZXxlbnwwfHx8fDE3NTcwMTA5NDd8MA&ixlib=rb-4.1.0&q=85"
                  alt="Medical Eye Analysis"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{t('ultraHighResolution')}</h4>
                  <p className="text-slate-400">{t('resolutionDescription')}</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            {t('readyToTransform')}
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            {t('ctaDescription')}
          </p>
          <Button 
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-12 py-4 text-xl rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
          >
            {t('startToday')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              CornealAI
            </span>
          </div>
          <p className="text-slate-500">
            {t('footerText')}
          </p>
        </div>
      </footer>
    </div>
  );
};

// Profile page component that handles auth redirect
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check for session_id in URL fragment first (from auth redirect)
        const fragment = window.location.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const sessionId = params.get('session_id');

        if (sessionId) {
          // Clear the fragment from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Call backend to validate session and get user data
          const response = await axios.post(`${API}/auth/validate-session`, {}, {
            headers: { 'X-Session-ID': sessionId },
            withCredentials: true
          });

          if (response.data.success) {
            setUser(response.data.user);
          }
        } else {
          // Check if user is already authenticated via cookie
          const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
          if (response.data.success) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        // Redirect to home if auth fails
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t('dashboardTitle')}
            </span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('welcome')}, {user.name}</h1>
          <p className="text-slate-400">{t('role')}: {user.role || 'Collaborator'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                {t('uploadFiles')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">{t('uploadDescription')}</p>
              <Button className="w-full">{t('startUpload')}</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {t('viewResults')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">{t('resultsDescription')}</p>
              <Button className="w-full" variant="outline">{t('viewAnalysis')}</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('collaborate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">{t('collaborateDescription')}</p>
              <Button className="w-full" variant="outline">{t('teamDashboard')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
