import React, { useState, useEffect } from 'react';
import { fetchJobs, deleteJob, fetchUsers, deleteUser } from '../services/api';

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
        loadData();
    }, [activeTab]);

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await deleteJob(id);
            loadData();
        } catch (err) {
            setError('Failed to delete job.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? All their jobs will be deleted too.")) return;
        try {
            await deleteUser(id);
            loadData();
        } catch (err) {
            setError('Failed to delete user.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen p-8 text-slate-100 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('jobs')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'jobs' ? 'bg-primary text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                            >
                                Jobs
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'users' ? 'bg-primary text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                            >
                                Users
                            </button>
                        </div>
                    </div>
                    <div className="space-x-4">
                        <button onClick={loadData} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
                            ⟳ Refresh
                        </button>
                        <button onClick={handleLogout} className="text-sm border border-danger/50 text-danger hover:bg-danger/10 px-4 py-2 rounded-lg transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="glass-panel overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                {activeTab === 'jobs' ? (
                                    <tr className="bg-slate-800/50 border-b border-slate-700 text-sm font-semibold text-slate-300">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Created At</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                ) : (
                                    <tr className="bg-slate-800/50 border-b border-slate-700 text-sm font-semibold text-slate-300">
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Username</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">Loading {activeTab}...</td>
                                    </tr>
                                ) : activeTab === 'jobs' ? (
                                    jobs.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-500">No jobs found.</td>
                                        </tr>
                                    ) : (
                                        jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 font-mono text-xs text-slate-400">
                                                    {job.id.split('-')[0]}...
                                                </td>
                                                <td className="p-4 font-medium">{job.type}</td>
                                                <td className="p-4 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                        {job.username ? job.username[0].toUpperCase() : '?'}
                                                    </div>
                                                    <span className="text-sm">{job.username || 'Unknown'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`badge badge-${job.status?.toLowerCase()}`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {new Date(job.created_at).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDeleteJob(job.id)} className="text-xs text-danger hover:text-white hover:bg-danger px-2 py-1 rounded transition-colors">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    users.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                                <td className="p-4 font-mono text-xs text-slate-400">{user.id}</td>
                                                <td className="p-4 font-medium text-white">{user.username}</td>
                                                <td className="p-4 text-slate-300">{user.email || 'N/A'}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => handleDeleteUser(user.id)} className="text-xs text-danger hover:text-white hover:bg-danger px-2 py-1 rounded transition-colors">
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
        </div>
    );
};

export default AdminDashboard;
