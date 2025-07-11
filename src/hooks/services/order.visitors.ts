import { http } from ".";

export const GetAllOrdersVisitors = async () => {
  return (await http.get("orders-visitors")).data;
};

export const DeleteOrderVisitor = async (id: string) => {
  return (await http.delete(`orders-visitors/${id}`)).data;
};
