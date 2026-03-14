import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
            {/* Hero Section */}
            <div className="text-center max-w-4xl pt-12 pb-20">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    System Operational · 98.7% Uptime
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mb-6 leading-tight">
                    Distributed Job<br />Processor
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Scalable, reliable, real-time background task management. Submit complex workloads and track progress with instant visibility.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login" className="btn-primary flex items-center gap-2 text-base">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#features" className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold rounded-lg text-base transition-all border border-slate-700 hover:border-slate-600">
                        Learn More
                    </a>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-8 mb-16 text-center">
                {[
                    { label: 'Jobs Processed', value: '1M+' },
                    { label: 'Avg Latency', value: '<200ms' },
                    { label: 'Uptime SLA', value: '99.9%' },
                ].map(stat => (
                    <div key={stat.label}>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Features Section */}
            <div id="features" className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 py-16 border-t border-slate-800/60">
                <div className="glass-panel p-7 rounded-xl hover:border-blue-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Real-time Tracking</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Monitor job status instantly. Built with modern polling to deliver up-to-date execution state and output logs.
                    </p>
                </div>

                <div className="glass-panel p-7 rounded-xl hover:border-purple-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Idempotent Execution</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Never worry about duplicate processing. Our idempotency mechanisms ensure safe retries and exactly-once execution logic.
                    </p>
                </div>

                <div className="glass-panel p-7 rounded-xl hover:border-indigo-500/40 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">Priority Queues</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Control resource allocation effectively. Assign priority levels to critical tasks so they are processed ahead of the queue.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;
