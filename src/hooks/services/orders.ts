import { http } from ".";

export const GetAllOrders = async () => {
  return (await http.get("orders")).data;
};

export const GetAllOrdersVisitors = async () => {
  return (await http.get("orders-visitors")).data;
};
