
export class OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export class OrderResponseDto {
  id: string;
  status: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
  };
  items: OrderItemResponseDto[];
  
}
