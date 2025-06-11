import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from '../common/dto/create-cart-item.dto';

@Controller('cart')
export class CartController {
  // Para efeito de teste, vamos assumir um userId fixo.
  private readonly userId = "83c7f2e3-5c2c-44a2-bd5f-c5ceebce9132";

  constructor(private readonly cartService: CartService) {}

  @Get()
  async getAllItems() {
    return await this.cartService.getCartItems(this.userId);
  }

  @Post()
  async addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return await this.cartService.addCartItem(this.userId, createCartItemDto);
  }

  @Put(':productId')
  async updateItem(
    @Param('productId') productId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.cartService.updateCartItem(this.userId, productId, quantity);
  }

  @Delete(':productId')
  async removeItem(@Param('productId') productId: string) {
    await this.cartService.removeCartItem(this.userId, productId);
    return { message: `Item ${productId} removed successfully.` };
  }
}
    