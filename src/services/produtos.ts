import { http } from '.';

export const GetProdutos = async () => {
  return (await http.get('produtos')).data;
};
