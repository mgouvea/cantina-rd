import { CreateExpenseDto, Expense } from "@/types";
import { http } from "./api";

export const PostAddExpense = async (expense: CreateExpenseDto) => {
  return (await http.post("expenses", expense)).data;
};

export const GetAllExpenses = async () => {
  return (await http.get("expenses")).data;
};

export const UpdateExpenseById = async (
  expenseId: string,
  expense: Expense
) => {
  return (await http.patch(`expenses/${expenseId}`, expense)).data;
};

export const DeleteExpenseById = async (expenseId: string) => {
  return (await http.delete(`expenses/${expenseId}`)).data;
};
