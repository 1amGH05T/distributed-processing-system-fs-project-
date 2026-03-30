import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Network, Zap, Server, Menu, LogOut, CheckCircle, AlertCircle, TrendingUp, Activity, Heart, RefreshCw, List, XCircle } from 'lucide-react';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import Landing from './components/Landing';
import { fetchJobs, createJob, checkAdmin, logout } from './services/api';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Zap },
    { name: 'Admin DB', path: '/admin', icon: Server, adminOnly: true },
  ];

  return (
    <div className="w-full h-full min-h-screen flex overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      {token && (
        <aside className={`w-64 border-r border-slate-700/60 bg-slate-900/70 backdrop-blur-xl flex flex-col absolute md:relative z-40 h-full transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-5 border-b border-slate-700/60 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Network className="text-white w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-tight">JobBox</div>
                <div className="text-xs text-slate-500">Processing System</div>
              </div>
            </div>
            <button className="md:hidden text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setIsSidebarOpen(false)}>
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-5 space-y-1">
            {navLinks.map((link) => {
              if (link.adminOnly && !isAdmin) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-blue-300 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
                  }`}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-slate-700/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut className="w-3.5 h-3.5 text-red-400" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col h-screen min-w-0">
        {/* Header */}
        <header className="border-b border-slate-700/60 bg-slate-900/40 backdrop-blur-xl px-5 md:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            {token && (
              <button
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo — only shown on public pages */}
            {!token && (
              <div className="flex items-center gap-2.5 mr-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow shadow-blue-500/20">
                  <Network className="text-white w-4 h-4" />
                </div>
                <Link to="/" className="text-base font-bold text-white tracking-tight">JobBox</Link>
              </div>
            )}

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <h1 className="text-base md:text-xl font-bold text-white truncate">
                {!token ? 'Welcome' : location.pathname === '/admin' ? 'Admin Dashboard' : 'Job Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                {!token
                  ? 'Distributed Task Management'
                  : location.pathname === '/admin'
                  ? 'Manage users and platform jobs'
                  : 'Real-time monitoring and task distribution'}
              </p>
            </div>

            {!token && (
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const JobDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

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
      // DESIGN-13: Use in-UI error state instead of blocking alert()
      setError('Error creating job: ' + err.message);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return job.status === 'COMPLETED';
    // DESIGN-2: backend uses 'DEAD' not 'FAILED' — fixed phantom status
    if (filter === 'Failed') return job.status === 'DEAD' || job.status === 'RETRY';
    return true;
  });

  const activeJobsCount = jobs.filter(j => j.status === 'RUNNING' || j.status === 'QUEUED').length;
  const completedJobsCount = jobs.filter(j => j.status === 'COMPLETED').length;

  return (
    <>
      {/* System Metrics */}
      <div className="stats-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Total Jobs</span>
            <TrendingUp className="w-[18px] h-[18px] text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{jobs.length}</div>
          <div className="text-xs text-green-400">All time jobs</div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Active Jobs</span>
            <Activity className="w-[18px] h-[18px] text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{activeJobsCount}</div>
          <div className="text-xs text-slate-400">Currently processing</div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Completed</span>
            <CheckCircle className="w-[18px] h-[18px] text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{completedJobsCount}</div>
          <div className="text-xs text-slate-400">Successfully finished</div>
        </div>
        <div className="metric-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">System Health</span>
            <Heart className="w-[18px] h-[18px] text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">98.7%</div>
          <div className="text-xs text-green-400">All systems nominal</div>
        </div>
      </div>

      <div className="mb-6">
        <JobForm onSubmit={handleCreateJob} />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 max-w-2xl mx-auto text-center">
          {error}
        </div>
      )}

      {/* Recent Jobs Tab */}
      <div className="mb-8 bg-slate-900/40 p-4 sm:p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 sm:gap-8 mb-6 border-b border-slate-700 overflow-x-auto">
          <button onClick={() => setFilter('All')} className={`tab-button ${filter === 'All' ? 'active' : ''}`}>
            <List className="w-4 h-4 inline-block mr-2" /> All Jobs
          </button>
          <button onClick={() => setFilter('Completed')} className={`tab-button ${filter === 'Completed' ? 'active' : ''}`}>
            <CheckCircle className="w-4 h-4 inline-block mr-2" /> Completed
          </button>
          <button onClick={() => setFilter('Failed')} className={`tab-button ${filter === 'Failed' ? 'active' : ''}`}>
            <AlertCircle className="w-4 h-4 inline-block mr-2" /> Failed
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Jobs</h3>
            <button onClick={loadJobs} className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="text-center text-slate-500 py-10">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No jobs found in this category.</div>
        ) : (
          <JobList jobs={filteredJobs} />
        )}
      </div>

      {/* Worker Nodes Simulation */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Worker Nodes (Simulated)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="worker-node online">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="pulse-dot bg-green-400"></span> 
              <span className="text-sm font-medium text-white">worker-01</span>
            </div>
            <div className="text-xs text-slate-400 mb-4">192.168.1.101</div>
            <div className="text-left">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">CPU</span> 
                <span className="text-white font-medium">72%</span>
              </div>
              <div className="resource-bar">
                <div className="resource-cpu" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
          <div className="worker-node online">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="pulse-dot bg-green-400"></span> 
              <span className="text-sm font-medium text-white">worker-02</span>
            </div>
            <div className="text-xs text-slate-400 mb-4">192.168.1.102</div>
            <div className="text-left">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">CPU</span> 
                <span className="text-white font-medium">58%</span>
              </div>
              <div className="resource-bar">
                <div className="resource-cpu" style={{ width: '58%' }}></div>
              </div>
            </div>
          </div>
          <div className="worker-node online">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="pulse-dot bg-green-400"></span> 
              <span className="text-sm font-medium text-white">worker-03</span>
            </div>
            <div className="text-xs text-slate-400 mb-4">192.168.1.103</div>
            <div className="text-left">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Memory</span> 
                <span className="text-white font-medium">84%</span>
              </div>
              <div className="resource-bar">
                <div className="resource-memory" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
          <div className="worker-node">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span> 
              <span className="text-sm font-medium text-slate-400">worker-04</span>
            </div>
            <div className="text-xs text-slate-500 mb-4">192.168.1.104</div>
            <div className="text-left">
              <div className="text-xs text-slate-500 text-center py-4">Offline</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Protect routes that require login
// DESIGN-12: Also check JWT expiry, not just string existence
const isTokenValid = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds; Date.now() is in ms
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
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
    <Layout>
      <div className="w-full h-full">
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
    </Layout>
  );
}

export default App;
