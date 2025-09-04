import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Eye, Brain, Shield, Users, Upload, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Landing Page Component
const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#technology" className="text-slate-300 hover:text-white transition-colors">Technology</a>
            <a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact</a>
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Login / Sign Up
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
              <a href="#features" className="block text-slate-300 hover:text-white">Features</a>
              <a href="#technology" className="block text-slate-300 hover:text-white">Technology</a>
              <a href="#contact" className="block text-slate-300 hover:text-white">Contact</a>
              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                Login / Sign Up
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
              Revolutionary AI Technology
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
              Discover Disease
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Through Your Eyes
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Our advanced artificial intelligence analyzes corneal characteristics combined with 
            comprehensive medical records from thousands of patients to identify disease patterns 
            and provide early diagnostic insights with unprecedented accuracy.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              Start Analysis
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Advanced Medical AI Platform
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Three specialized access levels designed for comprehensive medical analysis workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Admin Control</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">Complete platform management with full oversight capabilities.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Manage all users and permissions</li>
                  <li>• Monitor AI analysis outputs</li>
                  <li>• System configuration control</li>
                  <li>• Comprehensive audit trails</li>
                </ul>
              </CardContent>
            </Card>

            {/* Collaborator Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Collaborator Access</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">Upload and submit medical data for AI analysis processing.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Upload corneal photographs</li>
                  <li>• Submit patient medical records</li>
                  <li>• Request analysis processing</li>
                  <li>• Track submission status</li>
                </ul>
              </CardContent>
            </Card>

            {/* Scientist Features */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">Scientist Review</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300">
                <p className="mb-4">Review, validate and annotate AI-generated medical insights.</p>
                <ul className="space-y-2 text-sm">
                  <li>• Review analysis results</li>
                  <li>• Validate medical findings</li>
                  <li>• Add scientific annotations</li>
                  <li>• Generate research reports</li>
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
                Cutting-Edge AI Technology
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Our proprietary AI system leverages deep learning algorithms specifically trained 
                on medical imaging data to detect subtle patterns in corneal structure that may 
                indicate underlying health conditions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">MONAI Framework Integration</h3>
                    <p className="text-slate-400">Advanced medical imaging AI framework for precise corneal analysis</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">HIPAA Compliant</h3>
                    <p className="text-slate-400">Secure, encrypted platform meeting healthcare privacy standards</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Collaborative Workflow</h3>
                    <p className="text-slate-400">Multi-role platform designed for medical research teams</p>
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
                  <h4 className="text-lg font-semibold text-white mb-2">Ultra-High Resolution Analysis</h4>
                  <p className="text-slate-400">Advanced imaging processing capable of detecting microscopic corneal changes</p>
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
            Ready to Transform Medical Diagnostics?
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            Join healthcare professionals worldwide who trust CornealAI for advanced diagnostic insights.
          </p>
          <Button 
            onClick={handleLogin}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-12 py-4 text-xl rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
          >
            Start Your Analysis Today
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
            © 2024 CornealAI. Advanced medical imaging AI for healthcare professionals.
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
        <div className="text-white text-xl">Loading...</div>
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
              CornealAI Dashboard
            </span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-slate-400">Role: {user.role || 'Collaborator'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">Upload corneal images and medical records for AI analysis.</p>
              <Button className="w-full">Start Upload</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">Review AI analysis results and medical insights.</p>
              <Button className="w-full" variant="outline">View Analysis</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4">Work with your medical research team.</p>
              <Button className="w-full" variant="outline">Team Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;