import { CreatePaymentDto, PaymentResponse } from "@/types";
import { http } from "./api";

export const GetPayments: () => Promise<PaymentResponse[]> = async () => {
  return (await http.get("payments")).data;
};

export const CreatePayment = async (payment: CreatePaymentDto) => {
  return (await http.post("payments", payment)).data;
};
