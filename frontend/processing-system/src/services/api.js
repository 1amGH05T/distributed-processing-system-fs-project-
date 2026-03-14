// NOTE: For stronger XSS protection, consider migrating to HttpOnly cookies
// instead of localStorage for token storage in a production environment.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const login = async (username, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
            const data = await response.json();
            if (data.detail) errorMessage = data.detail;
        } catch (e) { }
        throw new Error(errorMessage);
    }
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
};

export const registerUser = async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
            const data = await response.json();
            if (data.username) errorMessage = data.username[0];
            else if (data.email) errorMessage = data.email[0];
            else if (data.password) errorMessage = data.password[0];
            else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
            else if (data.detail) errorMessage = data.detail;
        } catch (e) { }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const fetchJobs = async () => {
    const response = await fetch(`${BASE_URL}/jobs`, {
        headers: getAuthHeaders()
    });
    if (response.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/login'; // Quick redirect hack
    }
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
};

export const createJob = async (jobData) => {
    const response = await fetch(`${BASE_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
};

export const deleteJob = async (id) => {
    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete job');
    // 204 No Content typically doesn't return JSON
    return true;
};

export const fetchUsers = async () => {
    const response = await fetch(`${BASE_URL}/users`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const deleteUser = async (id) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return true;
};

export const checkAdmin = async () => {
    const response = await fetch(`${BASE_URL}/auth/check-admin`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to check admin status');
    return response.json();
};

/**
 * Centralized logout: clears stored tokens.
 * Import and call this from any component to avoid duplicating logout logic.
 */
export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};
