// NOTE: For stronger XSS protection, consider migrating to HttpOnly cookies
// instead of localStorage for token storage in a production environment.
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const API_PREFIX = '/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// BUG-6: Attempt a silent token refresh. Returns true if successful.
const tryRefreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;
    try {
        const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        });
        if (!res.ok) return false;
        let data;
        try{
            data = await res.json();
        }catch{
            return false
        }
        localStorage.setItem('access_token', data.access);
        return true;
    } catch {
        return false;
    }
};

// BUG-6: Centralized request helper — retries once after token refresh on 401.
const apiRequest = async (url, options = {}, retry = true) => {
    let response = await fetch(url, { ...options, headers: getAuthHeaders() });

    if (response.status === 401 && retry) {
        const refreshed = await tryRefreshToken();

        if (refreshed) {
            return apiRequest(url, options, false);
        }

        logout();
        throw new Error('Session expired. Please log in again.');
    }

    return response;
};

export const login = async (username, password) => {
    const response = await fetch(`${BASE_URL}${API_PREFIX}/auth/login`, {
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
    const response = await fetch(`${BASE_URL}${API_PREFIX}/auth/register`, {
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
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    const data = await response.json();
    // DESIGN-4: DRF pagination returns { count, next, previous, results: [...] }
    return Array.isArray(data) ? data : (data.results ?? []);
};

export const createJob = async (jobData) => {
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/jobs`, {
        method: 'POST',
        body: JSON.stringify(jobData),
    });
    if (!response.ok) {
        let errorMessage = 'Failed to create job';
        try {
            const data = await response.json();
            if (data.detail) errorMessage = data.detail;
            else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
            else {
                const firstKey = Object.keys(data)[0];
                if (firstKey) errorMessage = `${firstKey}: ${data[firstKey]}`;
            }
        } catch (e) { }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const deleteJob = async (id) => {
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/jobs/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete job');
    // 204 No Content typically doesn't return JSON
    return true;
};

export const fetchUsers = async () => {
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return Array.isArray(data) ? data : (data.results ?? []);
};

export const deleteUser = async (id) => {
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/users/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return true;
};

export const checkAdmin = async () => {
    const response = await apiRequest(`${BASE_URL}${API_PREFIX}/auth/check-admin`);
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
