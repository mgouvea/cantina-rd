import { CreateCreditDto } from "@/types/credit";
import { http } from "./api";

export const CreateCredit = async (credit: CreateCreditDto) => {
  return (await http.post("credit", credit)).data;
};

export const GetCredits = async () => {
  return (await http.get("credit")).data;
};
