export type Products = {
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  subcategory: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Categories = {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SubCategories = {
  _id?: string;
  name: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
