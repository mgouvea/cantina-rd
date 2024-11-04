export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  telephone: string;
  groupFamily: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ClienteResponse = {
  status: number;
  data: User[];
};
