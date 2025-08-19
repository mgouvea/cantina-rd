export type TotalContents = {
  totalOrders: number;
  totalPayments: number;
  totalOpenInvoices: number;
  totalOpenInvoicesWithoutDateRange: number;
};

export type MostSoldProducts = {
  _id?: string;
  name: string;
  price: number;
  totalQuantity: number;
  urlImage: string;
};

export type TopClientsDto = {
  _id?: string;
  name: string;
  totalSpent: number;
  ordersCount: number;
  averageOrderValue: number;
  groupFamilyId: string;
  groupFamilyName: string;
  urlImage: string;
};

export type PaymentsVsReceives = {
  _id?: string;
  payments: number[];
  expenses: number[];
  xLabels: string[];
};
