import { BrowserRouter as Router, Routes, Route, Navigate, Suspense } from 'react-router-dom';
import { lazy } from 'react';
import { useAuthStore } from '@/store';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import './App.css';

// Lazy load pages for faster initial load
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Matches = lazy(() => import('@/pages/Matches'));
const Requests = lazy(() => import('@/pages/Requests'));
const Assessment = lazy(() => import('@/pages/Assessment'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin mx-auto mb-3"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  const { user, token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><About /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<LoadingFallback />}><Contact /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><Privacy /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={<LoadingFallback />}><Terms /></Suspense>} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Suspense fallback={<LoadingFallback />}><Login /></Suspense>}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Suspense fallback={<LoadingFallback />}><Register /></Suspense>}
        />

        {/* Protected Routes */}
        {token ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<LoadingFallback />}><Profile /></Suspense>} />
            <Route path="/assessment" element={<Suspense fallback={<LoadingFallback />}><Assessment /></Suspense>} />
            <Route path="/matches" element={<Suspense fallback={<LoadingFallback />}><Matches /></Suspense>} />
            <Route path="/requests" element={<Suspense fallback={<LoadingFallback />}><Requests /></Suspense>} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
