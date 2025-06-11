import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string; // "brazilian-1" ou "european-1"

  @IsNumber()
  @Min(1)
  quantity: number;
}
