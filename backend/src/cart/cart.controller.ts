import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from '../common/dto/create-cart-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getAllItems(@GetUser() user: any) {
    return await this.cartService.getCartItems(user.id);
  }

  @Post()
  async addItem(
    @GetUser() user: any,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return await this.cartService.addCartItem(user.id, createCartItemDto);
  }

  @Put(':productId')
  async updateItem(
    @GetUser() user: any,
    @Param('productId') productId: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return await this.cartService.updateCartItem(user.id, productId, quantity);
  }

  @Delete(':productId')
  async removeItem(
    @GetUser() user: any,
    @Param('productId') productId: string,
  ) {
    await this.cartService.removeCartItem(user.id, productId);
    return { message: `Item ${productId} removed successfully.` };
  }
}
