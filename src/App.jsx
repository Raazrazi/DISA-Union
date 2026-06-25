import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StorageProvider } from './context/StorageContext';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import WingProfile from './pages/WingProfile.jsx';
import Archive from './pages/Archive.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Lenis from 'lenis';

const App = () => {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <StorageProvider>
        <Router>
          <div className="relative min-h-screen flex flex-col justify-between">
            <Navbar />
            <div className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/wing/:name" element={<WingProfile />} />
                <Route path="/archive" element={<RouteTransition><Archive /></RouteTransition>} />
                <Route path="/dashboard" element={<RouteTransition><Dashboard /></RouteTransition>} />
                <Route path="/login" element={<RouteTransition><Login /></RouteTransition>} />
              </Routes>
            </div>
          </div>
        </Router>
      </StorageProvider>
    </AuthProvider>
  );
};

// Simplified route transition fade-in helper
const RouteTransition = ({ children }) => {
  return (
    <div className="animate-fade-in duration-300">
      {children}
    </div>
  );
};

export default App;
