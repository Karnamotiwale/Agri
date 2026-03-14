// ============================================
// API CLIENT
// ============================================

import axios from 'axios';

// Create a real axios instance pointing to the local Flask backend
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 60000, 
});
