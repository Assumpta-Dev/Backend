export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}
