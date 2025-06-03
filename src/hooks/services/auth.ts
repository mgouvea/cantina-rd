import { Auth } from '@/types';
import { http } from './api';

export const Login = async (data: Auth) => {
  return (await http.post('login', data)).data;
};
