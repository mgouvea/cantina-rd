export type Credit = {
  _id?: string;
  creditedAmount: number;
  amount: number;
  groupFamilyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Debit = {
  _id: string;
  amount: number;
  groupFamilyId: string;
  includedInInvoice?: boolean;
  invoiceId?: string;
  createdAt: Date;
};

export type CreditMessage = {
  groupFamilyId: string;
  isAutomatic: boolean;
  addedValue: number;
};

export type CreateCreditDto = Omit<Credit, "_id" | "createdAt" | "updatedAt">;

export type CreditResponse = Credit & {
  groupFamilyName: string;
};

export type CreateDebitDto = Omit<Debit, "_id" | "createdAt" | "invoiceId">;
