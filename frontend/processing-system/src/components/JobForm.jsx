import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';

const JobForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        type: '',
        payload: '{}',
        priority: 0,
        max_attempts: 3,
        idempotency_key: ''
    });
    const [isOpen, setIsOpen] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const parsedPayload = JSON.parse(formData.payload);
            onSubmit({
                ...formData,
                payload: parsedPayload,
                priority: parseInt(formData.priority, 10),
                max_attempts: parseInt(formData.max_attempts, 10)
            });
            // Reset form
            setFormData({ type: '', payload: '{}', priority: 0, max_attempts: 3, idempotency_key: '' });
        } catch {
            alert('Invalid JSON payload. Please check your formatting.');
        }
    };

    return (
        <div className="glass-panel overflow-hidden">
            {/* Collapsible Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-700/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                        <PlusCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-white">Create New Job</h2>
                        <p className="text-xs text-slate-500">Submit a new distributed task</p>
                    </div>
                </div>
                {isOpen
                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                    : <ChevronDown className="w-4 h-4 text-slate-400" />
                }
            </button>

            {isOpen && (
                <div className="border-t border-slate-700/50 px-6 py-5">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Type <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    placeholder="e.g. email.send"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Idempotency Key <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    name="idempotency_key"
                                    required
                                    value={formData.idempotency_key}
                                    onChange={handleChange}
                                    placeholder="Unique identifier"
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                                <input
                                    type="number"
                                    name="priority"
                                    min="0"
                                    max="10"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                                <p className="text-xs text-slate-500 mt-1">Higher = processed first (0–10)</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Max Attempts</label>
                                <input
                                    type="number"
                                    name="max_attempts"
                                    min="1"
                                    max="10"
                                    value={formData.max_attempts}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                                <p className="text-xs text-slate-500 mt-1">Retry limit on failure</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Payload <span className="text-slate-500 font-normal">(JSON)</span></label>
                            <textarea
                                name="payload"
                                rows={4}
                                required
                                value={formData.payload}
                                onChange={handleChange}
                                className="input-field font-mono text-sm resize-none"
                                spellCheck={false}
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <button type="submit" className="btn-primary flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Submit Job
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobForm;
