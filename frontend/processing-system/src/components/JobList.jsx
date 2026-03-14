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
        <div className="flex flex-col">
            {jobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default JobList;
