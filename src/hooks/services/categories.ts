import { Categories, SubCategories } from "@/types/products";
import { http } from "./api";

export const GetCategories = async () => {
  return (await http.get("categories")).data;
};

export const GetSubCategories = async () => {
  return (await http.get("subcategories")).data;
};

export const PostAddCategories = async (categories: Categories) => {
  return (await http.post("categories", categories)).data;
};

export const PostAddSubCategories = async (subcategories: SubCategories) => {
  return (await http.post("subcategories", subcategories)).data;
};

export const UpdateCategory = async ({
  categoriesId,
  categories,
}: {
  categoriesId: string;
  categories: Categories;
}) => {
  return (await http.patch(`categories/${categoriesId}`, categories)).data;
};

export const UpdateSubCategory = async ({
  subCategoriesId,
  subCategories,
}: {
  subCategoriesId: string;
  subCategories: SubCategories;
}) => {
  return (await http.patch(`subcategories/${subCategoriesId}`, subCategories))
    .data;
};

export const DeleteCategory = async (id: string) => {
  return (await http.delete(`categories/${id}`)).data;
};

export const DeleteSubCategory = async (id: string) => {
  return (await http.delete(`subcategories/${id}`)).data;
};
