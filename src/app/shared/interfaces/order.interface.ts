
export interface Order {
  id: number;
  name: string;
  date: string;
  shippingAddress: string;
  isDelivery: boolean;
  city: string;
}

export interface Details {
  productId: number;
  productName: string;
  quantity: number;
}

export interface DetailsOrder {
  details: Details[];
  orderId: number;
}
