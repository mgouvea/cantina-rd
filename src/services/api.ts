import axios from 'axios';

const appApi = process.env.NEXT_PUBLIC_APP_API;

export const http = axios.create({
  baseURL: appApi,
  timeout: 30000,
});
