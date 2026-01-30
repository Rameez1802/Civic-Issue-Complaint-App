// src/config/api.js

const BASE_URL = 'https://civic-issue-complaint-app.onrender.com';

export const API = {
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/reset-password`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  REPORT_STATS: `${BASE_URL}/api/reports/stats`,
};
