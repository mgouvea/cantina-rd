import { CreateVisitorPaymentDto, VisitorPaymentResponse } from "@/types";
import { http } from "./api";

export const GetVisitorPayments: () => Promise<
  VisitorPaymentResponse[]
> = async () => {
  return (await http.get("visitors-payment")).data;
};

export const CreateVisitorPayment = async (
  payment: CreateVisitorPaymentDto
) => {
  return (await http.post("visitors-payment", payment)).data;
};
