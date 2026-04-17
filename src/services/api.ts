// ============================================
// API CLIENT
// ============================================

import axios from 'axios';

// Create a real axios instance pointing to the local Flask backend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 60000, 
});
