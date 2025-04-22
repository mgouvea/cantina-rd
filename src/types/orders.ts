export interface ProductItem {
  id: string;
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
