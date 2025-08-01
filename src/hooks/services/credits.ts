import { CreateCreditDto, CreateDebitDto } from "@/types/credit";
import { http } from "./api";

export const CreateCredit = async (credit: CreateCreditDto) => {
  return (await http.post("credit", credit)).data;
};

export const CreateDebit = async (debit: CreateDebitDto) => {
  return (await http.post("debit", debit)).data;
};

export const GetActiveCredits = async () => {
  return (await http.get("credit")).data;
};

export const GetArchiveCredits = async () => {
  return (await http.get("credit/archive")).data;
};
