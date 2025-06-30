export interface ProductItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  buyerId: string;
  groupFamilyId: string;
  products: ProductItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderVisitor {
  _id: string;
  buyerId: string;
  visitorName: string;
  products: ProductItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateOrderDto {
  buyerId: string;
  invoiceId?: string;
  groupFamilyId: string;
  products: ProductItem[];
  totalPrice: number;
  createdAt: string;
}
