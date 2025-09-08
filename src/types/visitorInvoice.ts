interface ProductsOrdered {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  buyerId: string;
  products: ProductsOrdered[];
  totalPrice: number;
  createdAt: string;
}

interface consumoPorPessoa {
  [key: string]: {
    date: string;
    products: ProductsOrdered[];
  }[];
}

enum Status {
  OPEN = "OPEN",
  CLOSED = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
}

export interface visitorInvoiceDto {
  _id: string;
  buyerId: string;
  startDate: string;
  endDate: string;
  sentByWhatsapp: boolean;
  totalAmount: number;
  paidAmount: number;
  status: Status;
  createdAt: string;
  orders: Order[];
  payments: [];
  consumoPorPessoa: consumoPorPessoa;
  visitorName: string;
  remaining: number;
}
