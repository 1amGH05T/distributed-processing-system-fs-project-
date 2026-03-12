import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Landing from './components/Landing';
import { fetchJobs, createJob, checkAdmin } from './services/api';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      checkAdmin().then(data => setIsAdmin(data.is_admin)).catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <nav className="w-full bg-slate-800/80 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">JobBox</Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Submit Jobs</Link>
              {isAdmin && <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">Admin DB</Link>}
              <button onClick={handleLogout} className="text-danger hover:text-red-400 transition-colors ml-4 border-l border-slate-700 pl-4">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
              <Link to="/login" className="text-slate-300 hover:text-white transition-colors ml-4 border-l border-slate-700 pl-4">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jobs. Check backend connection or authentication.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      loadJobs();
    } catch (err) {
      alert("Error creating job: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
          Distributed Job Processor
        </h1>
        <p className="text-slate-400">Manage and monitor background tasks in real-time</p>
      </header>

      <JobForm onSubmit={handleCreateJob} />

      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-b border-slate-700 pb-2 inline-block">
            My Active Jobs
          </h2>
          <button onClick={loadJobs} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-md transition-colors">
            ⟳ Refresh
          </button>
        </div>

        {error && (
          <div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg mb-6 max-w-2xl mx-auto text-center">
            {error}
          </div>
        )}

        {loading && jobs.length === 0 ? (
          <div className="text-center text-slate-500 py-10">Loading jobs...</div>
        ) : (
          <JobList jobs={jobs} />
        )}
      </div>
    </div>
  );
};

// Protect routes that require login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    if (token) {
      checkAdmin()
        .then(data => setIsAdmin(data.is_admin))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  if (isAdmin === null) return <div className="p-8 text-center text-slate-400">Verifying access...</div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen text-slate-100 font-sans flex flex-col">
      <Navigation />

      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><JobDashboard /></PrivateRoute>}
          />
          <Route
            path="/admin"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
