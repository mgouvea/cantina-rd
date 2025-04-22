import { http } from ".";

export const GetAllOrders = async () => {
  return (await http.get("orders")).data;
};
