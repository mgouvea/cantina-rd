export interface CreateInvoiceDto {
  startDate: Date | null;
  endDate: Date | null;
}

export interface CreateInvoiceClientDto extends CreateInvoiceDto {
  groupFamilyIds: string[];
}

export interface CreateInvoiceVisitorsDto extends CreateInvoiceDto {
  visitorsIds: string[];
}

export type InvoiceDto = {
  _id: string;
  buyerIds: string[];
  groupFamilyId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  sentByWhatsApp: boolean;
  status: "OPEN" | "PARTIALLY_PAID" | "PAID";
  createdAt: Date;
};

export interface FullInvoiceResponse {
  _id: string;
  groupFamilyId: string;
  buyerIds: string[];
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  originalAmount?: number;
  appliedCredit?: number;
  creditId?: string;
  debitAmount?: number;
  paidAmount: number;
  sentByWhatsapp: boolean;
  status: "OPEN" | "PARTIALLY_PAID" | "PAID";
  createdAt: Date;
  orders: {
    _id: string;
    buyerId: string;
    groupFamilyId: string;
    products: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[];
    totalPrice: number;
    createdAt: Date;
  }[];
  payments: {
    _id: string;
    amountPaid: number;
    isPartial: boolean;
    isCredit: boolean;
    paymentDate: Date;
    createdAt: Date;
  }[];
  consumoPorPessoa: Record<
    string,
    {
      date: Date;
      products: {
        id: string;
        name: string;
        price: number;
        quantity: number;
      }[];
    }[]
  >;
  consumidoresNomes: Record<string, string>;
  ownerName: string;
  remaining: number;
}
