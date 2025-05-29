export interface PaymentDto {
  _id: string;
  invoiceId: string;
  amountPaid: number;
  paymentDate: Date;
  isPartial: boolean;
  isCredit: boolean;
  createdAt: Date;
}

export interface PaymentResponse {
  _id: string;
  invoiceId: string;
  amountPaid: number;
  paymentDate: Date;
  isPartial: boolean;
  isCredit: boolean;
  createdAt: Date;
  groupFamilyName: string;
  invoicePeriod: {
    startDate: Date;
    endDate: Date;
  };
  invoiceStatus: string;
  invoiceTotalAmount: number;
}

export type CreatePaymentDto = Omit<PaymentDto, "_id" | "createdAt">;
