export type Cliente = {
  id: number;
  nomeCompleto: string;
  telefone: string;
  email: string;
  grupoFamiliar: string;
};

export type ClienteResponse = {
  status: number;
  data: Cliente[];
};
