export type Credit = {
  _id?: string;
  creditedAmount: number;
  amount: number;
  groupFamilyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateCreditDto = Omit<Credit, "_id" | "createdAt" | "updatedAt">;

export type CreditResponse = Credit & {
  groupFamilyName: string;
};
