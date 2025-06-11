export class ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];

  // Campos específicos do fornecedor brasileiro
  category?: string;
  material?: string;
  department?: string;

  // Campos específicos do fornecedor europeu
  hasDiscount?: boolean;
  discountValue?: number;
  
  // Origem
  provider: string;
}
