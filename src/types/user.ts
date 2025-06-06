export type User = {
  _id?: string;
  name: string;
  email?: string;
  isAdmin: boolean;
  telephone: string;
  urlImage: string;
  groupFamily: string | null;
  isChild: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export type UserAdmin = {
  _id?: string;
  idUser: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date | null;
};

export type GroupFamilyUser = {
  name?: string;
  userId: string;
};
