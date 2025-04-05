import { Products } from '@/types/products';
import { http } from '.';

export const GetProducts = async () => {
  return (await http.get('products')).data;
};

export const PostAddProduct = async (product: Products) => {
  return (await http.post('products', product)).data;
};