import React from 'react';
import { Eye, CheckCircle, Clock, Play, RotateCw, XCircle } from 'lucide-react';

const JobCard = ({ job }) => {
    const getProgress = (status) => {
        if (status === 'COMPLETED') return 100;
        if (status === 'RUNNING') return 60;
        if (status === 'FAILED' || status === 'DEAD') return 0;
        return 10; // QUEUED or CREATED
    };

    const getStatusContent = (status) => {
        switch (status) {
            case 'CREATED': 
            case 'QUEUED':
                return { 
                    badgeClass: 'status-queued', 
                    icon: <Clock className="w-3 h-3" />, 
                    text: status,
                    worker: 'Pending',
                    workerStatus: 'Not assigned',
                    actionIcon: <Play className="w-3.5 h-3.5" />
                };
            case 'RUNNING': 
                return { 
                    badgeClass: 'status-running', 
                    icon: <span className="pulse-dot bg-green-400"></span>, 
                    text: status,
                    worker: `worker-${Math.floor(Math.random() * 10) + 1}`,
                    workerStatus: 'Processing',
                    actionIcon: <Eye className="w-3.5 h-3.5" />
                };
            case 'COMPLETED': 
                return { 
                    badgeClass: 'status-completed', 
                    icon: <CheckCircle className="w-3 h-3" />, 
                    text: status,
                    worker: 'System',
                    workerStatus: 'Finished',
                    actionIcon: <Eye className="w-3.5 h-3.5" />
                };
            case 'RETRY':
                return { 
                    badgeClass: 'status-queued text-orange-400 bg-orange-500/10', 
                    icon: <RotateCw className="w-3 h-3" />, 
                    text: status,
                    worker: 'System',
                    workerStatus: `Attempt ${job.attempts}/${job.max_attempts}`,
                    actionIcon: <Eye className="w-3.5 h-3.5" />
                };
            case 'DEAD': 
            default:
                return { 
                    badgeClass: 'status-failed', 
                    icon: <XCircle className="w-3 h-3" />, 
                    text: status || 'FAILED',
                    worker: 'System',
                    workerStatus: 'Error occurred',
                    actionIcon: <RotateCw className="w-3.5 h-3.5" />
                };
        }
    };

    const statusContent = getStatusContent(job.status);
    const progress = getProgress(job.status);

    return (
        <div className="job-row">
            <div>
                <div className="font-medium text-white mb-1 truncate pr-2" title={job.type}>
                    {job.type}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                    ID: {job.id.substring(0, 13)}...
                </div>
            </div>
            <div>
                <div className="text-xs text-slate-400 mb-2 flex justify-between">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div>
                <span className={`status-badge ${statusContent.badgeClass}`}>
                    {statusContent.icon} {statusContent.text}
                </span>
            </div>
            <div>
                <div className="text-sm text-slate-300">
                    {statusContent.worker}
                </div>
                <div className="text-xs text-slate-500">
                    {statusContent.workerStatus}
                </div>
            </div>
            <div className="flex justify-center md:justify-end pr-2">
                <button className="action-btn" title="View Details">
                    {statusContent.actionIcon}
                </button>
            </div>
        </div>
    );
};

export default JobCard;
