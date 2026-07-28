import axios from 'axios';

const DEFAULT_API_URL = 'http://192.168.0.86:3001';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || DEFAULT_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});
