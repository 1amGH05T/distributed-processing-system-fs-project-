import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
            {/* Hero Section */}
            <div className="text-center max-w-4xl pt-12 pb-20">
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6 drop-shadow-md">
                    Distributed Job Processor
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Scalable, reliable, and real-time background task management. Process your complex workloads with ease and track progress instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login" className="px-8 py-4 bg-primary hover:bg-emerald-500 text-white font-bold rounded-lg text-lg transition-all shadow-lg shadow-emerald-500/30 transform hover:-translate-y-1">
                        Get Started
                    </Link>
                    <a href="#features" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-lg transition-all border border-slate-700 hover:border-slate-500">
                        Learn More
                    </a>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-slate-800/50">
                <div className="glass-panel p-8 rounded-xl hover:border-emerald-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-6">
                        ⚡
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Real-time Tracking</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Monitor the status of your jobs instantly. Built with modern polling to provide up-to-date execution status and output logs.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-xl hover:border-emerald-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-6">
                        🛡️
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Idempotent Execution</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Never worry about duplicate processing. Our robust idempotency mechanisms ensure safe retries and exactly-once execution logic.
                    </p>
                </div>

                <div className="glass-panel p-8 rounded-xl hover:border-emerald-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-6">
                        ⚖️
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Priority Queues</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Control resource allocation effectively. Assign priority levels to critical tasks to ensure they are processed ahead of the background noise.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
