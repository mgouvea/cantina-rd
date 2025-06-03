import { Products } from "@/types/products";
import { http } from ".";

export const GetProducts = async () => {
  return (await http.get("products")).data;
};

export const PostAddProduct = async (product: Products) => {
  return (await http.post("products", product)).data;
};

export const UpdateProduct = async ({
  productId,
  product,
}: {
  productId: string;
  product: Products;
}) => {
  return (await http.patch<Products>(`products/${productId}`, product)).data;
};

export const DeleteProduct = async ({ productId }: { productId: string }) => {
  return (await http.delete<Products>(`products/${productId}`)).data;
};
