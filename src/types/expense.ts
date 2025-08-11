export interface Expense {
  _id?: string;
  userId: string;
  groupFamilyId: string;
  description: string;
  expenseDate: Date | null;
  referenceMonth: Date | null;
  expenseValue: number;
  expenseType: "canteenCard" | "canteenCredit" | "paidByTreasurer" | "refund";
  urlImage: string;
  publicIdImage: string;
  createdAt: Date;
}

export type CreateExpenseDto = Omit<
  Expense,
  "_id" | "createdAt" | "publicIdImage" | "urlImage" | "groupFamilyId"
>;
