import React from 'react';
import JobCard from './JobCard';

const JobList = ({ jobs }) => {
    if (!jobs || jobs.length === 0) {
        return (
            <div className="text-center text-slate-500 py-10 glass-panel">
                No jobs found. Create one above!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default JobList;
