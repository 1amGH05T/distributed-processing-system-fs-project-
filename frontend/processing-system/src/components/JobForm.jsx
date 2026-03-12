import React, { useState } from 'react';

const JobForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        type: '',
        payload: '{}',
        priority: 0,
        max_attempts: 3,
        idempotency_key: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            // Optionally reset form here
        } catch (err) {
            alert("Invalid JSON payload");
        }
    };

    return (
        <div className="glass-panel p-6 mb-8 w-full max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-primary">Create New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Job Type</label>
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
                        <label className="block text-sm font-medium text-slate-400 mb-1">Idempotency Key</label>
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
                        <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                        <input
                            type="number"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Max Attempts</label>
                        <input
                            type="number"
                            name="max_attempts"
                            value={formData.max_attempts}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Payload (JSON)</label>
                    <textarea
                        name="payload"
                        rows="4"
                        required
                        value={formData.payload}
                        onChange={handleChange}
                        className="input-field font-mono text-sm"
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full mt-4">
                    Submit Job
                </button>
            </form>
        </div>
    );
};

export default JobForm;
