import { http } from ".";

export const GetAllOrders = async () => {
  return (await http.get("orders")).data;
};

export const GetAllOrdersVisitors = async () => {
  return (await http.get("orders-visitors")).data;
};

export const DeleteOrder = async (_id: string) => {
  return (await http.delete(`orders/${_id}`)).data;
};
