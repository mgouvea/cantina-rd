import { http } from '.';

export const GetClientes = async () => {
  return (await http.get('clientes')).data;
};
