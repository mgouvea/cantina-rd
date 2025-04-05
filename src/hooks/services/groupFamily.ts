import { groupFamily } from '@/types/groupFamily';
import { http } from './api';

export const PostAddGroupFamily = async (groupFamily: groupFamily) => {
  return (await http.post('group-family', groupFamily)).data;
};

export const GetAllGroupFamilies = async () => {
  return (await http.get('group-family')).data;
};


