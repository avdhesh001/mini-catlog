import axios, { AxiosInstance } from 'axios';

const apiBaseURL = 'mock://local';

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 8000,
});

export type ApiError = {
  message: string;
};
