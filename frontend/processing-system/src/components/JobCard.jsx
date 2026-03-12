import React from 'react';

const JobCard = ({ job }) => {
    const getBadgeClass = (status) => {
        switch (status) {
            case 'CREATED': return 'badge-created';
            case 'QUEUED': return 'badge-queued';
            case 'RUNNING': return 'badge-running';
            case 'COMPLETED': return 'badge-completed';
            case 'RETRY': return 'badge-retry';
            case 'DEAD': return 'badge-dead';
            default: return 'badge-created';
        }
    };

    return (
        <div className="glass-panel p-5 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-slate-200 truncate pr-2" title={job.type}>
                    {job.type}
                </h3>
                <span className={`badge ${getBadgeClass(job.status)}`}>
                    {job.status}
                </span>
            </div>

            <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="text-slate-300">{job.priority}</span>
                </div>
                <div className="flex justify-between">
                    <span>Attempts:</span>
                    <span className="text-slate-300">{job.attempts} / {job.max_attempts}</span>
                </div>
                <div className="text-xs truncate text-slate-500 mt-2" title={job.id}>
                    ID: {job.id}
                </div>
            </div>
        </div>
    );
};

export default JobCard;
