export type Products = {
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  categoryId: string | Categories;
  subcategoryId: string | SubCategories;
  imageBase64: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Categories = {
  _id?: string;
  name: string;
  base64Image: string;
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
