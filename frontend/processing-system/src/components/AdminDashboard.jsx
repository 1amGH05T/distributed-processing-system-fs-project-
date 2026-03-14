import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Briefcase, Users } from 'lucide-react';
import { fetchJobs, deleteJob, fetchUsers, deleteUser } from '../services/api';

const statusClass = (status) => {
    const map = {
        QUEUED: 'status-queued',
        CREATED: 'status-created',
        RUNNING: 'status-running',
        COMPLETED: 'status-completed',
        FAILED: 'status-failed',
        DEAD: 'status-dead',
        RETRY: 'status-retry',
    };
    return map[status?.toUpperCase()] || 'status-queued';
};

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'jobs') {
                const data = await fetchJobs();
                setJobs(data);
            } else {
                const data = await fetchUsers();
                setUsers(data);
            }
            setError(null);
        } catch (err) {
            setError(`Failed to load ${activeTab}. Check backend connection or authentication.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setJobs([]);
        setUsers([]);
        loadData();
    }, [activeTab]);

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await deleteJob(id);
            loadData();
        } catch {
            setError('Failed to delete job.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user? All their jobs will be removed too.')) return;
        try {
            await deleteUser(id);
            loadData();
        } catch {
            setError('Failed to delete user.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Tab Switcher */}
                <div className="flex bg-slate-800/80 border border-slate-700/50 rounded-xl p-1 gap-1">
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'jobs'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Jobs <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'jobs' ? 'bg-white/20' : 'bg-slate-700'}`}>{jobs.length || ''}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'users'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Users <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'users' ? 'bg-white/20' : 'bg-slate-700'}`}>{users.length || ''}</span>
                    </button>
                </div>

                <button
                    onClick={loadData}
                    className="flex items-center gap-2 text-sm bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 px-4 py-2 rounded-lg transition-all"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-5 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {activeTab === 'jobs' ? (
                                <tr className="bg-slate-800/60 border-b border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th className="px-5 py-4">ID</th>
                                    <th className="px-5 py-4">Type</th>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Created</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            ) : (
                                <tr className="bg-slate-800/60 border-b border-slate-700/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th className="px-5 py-4">ID</th>
                                    <th className="px-5 py-4">Username</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
                                            Loading {activeTab}…
                                        </div>
                                    </td>
                                </tr>
                            ) : activeTab === 'jobs' ? (
                                jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-5 py-12 text-center text-slate-500">No jobs found.</td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{job.id.split('-')[0]}…</td>
                                            <td className="px-5 py-4 font-medium text-white text-sm">{job.type}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                                                        {job.username ? job.username[0].toUpperCase() : '?'}
                                                    </div>
                                                    <span className="text-sm text-slate-300">{job.username || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`status-badge ${statusClass(job.status)}`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-400">
                                                {new Date(job.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteJob(job.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-5 py-12 text-center text-slate-500">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-4 font-mono text-xs text-slate-500">{user.id}</td>
                                            <td className="px-5 py-4 font-medium text-white">{user.username}</td>
                                            <td className="px-5 py-4 text-slate-300 text-sm">{user.email || '—'}</td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
