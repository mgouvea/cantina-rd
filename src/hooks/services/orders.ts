import { http } from ".";
import { CreateOrderDto } from "@/types/orders";

export const GetAllOrders = async () => {
  return (await http.get("orders")).data;
};

export const PostAddManyOrders = async (order: CreateOrderDto[]) => {
  return (await http.post("orders/many", order)).data;
};

export const DeleteOrder = async (_id: string) => {
  return (await http.delete(`orders/${_id}`)).data;
};
