import { Categories, SubCategories } from "@/types/products";
import { http } from "./api";

export const GetCategories = async () => {
    return (await http.get('categories')).data;
  };

export const GetSubCategories = async () => {
    return (await http.get('subcategories')).data;
  };
  
  export const PostAddCategories = async (categories: Categories) => {
    return (await http.post('categories', categories)).data;
  };

  export const PostAddSubCategories = async (categories: SubCategories) => {
    return (await http.post('categories', categories)).data;
  };