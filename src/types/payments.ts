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

export interface VisitorPaymentResponse {
  _id: string;
  invoiceId: string;
  amountPaid: number;
  paymentDate: Date;
  isPartial: boolean;
  createdAt: Date;
  visitorName: string;
  invoicePeriod: {
    startDate: Date;
    endDate: Date;
  };
  invoiceStatus: string;
  invoiceTotalAmount: number;
}

export type CreatePaymentDto = Omit<PaymentDto, "_id" | "createdAt">;
export type CreateVisitorPaymentDto = Omit<
  PaymentDto,
  "_id" | "createdAt" | "isCredit" | "paymentDate"
>;
