import { SelectChangeEvent } from "@mui/material";
import { ChangeEvent } from "react";
import { Control, UseFormReset } from "react-hook-form";

export type Products = {
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  tag: string;
  categoryId: Categories;
  subcategoryId: SubCategories;
  imageBase64: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Categories = {
  _id?: string;
  name: string;
  imageBase64: string;
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

export type fotoUploadProps = {
  base64: string;
  name: string;
  size: number;
  type: string;
};

export type ProductsFormProps = {
  control: Control<Products>;
  handleSaveProducts: () => void;
  reset: UseFormReset<Products>;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  filteredSubcategories: SubCategories[];
  handleSetCategory: (event: SelectChangeEvent<string>) => void;
  handleSetSubcategory: (event: SelectChangeEvent<string>) => void;
  categories: Categories[] | undefined;
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void;
  setFilteredSubcategories: (value: SubCategories[]) => void;
  fotoProduto: fotoUploadProps | null;
  setFotoProduto: (value: fotoUploadProps | null) => void;
  hovering: boolean;
  setHovering: (value: boolean) => void;
  handleUploadFile: (event: ChangeEvent<HTMLInputElement>) => void;
};
