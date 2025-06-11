import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { OrderStatus } from './order.entity';
import { UserRole } from 'src/users/user.entity';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@GetUser() user: any) {
    return await this.ordersService.createOrder(user.id);
  }

  @Get()
  async getOrders(@GetUser() user: any) {
    return await this.ordersService.getOrders(user.id);
  }

  @Get(':orderId')
  async getOrderById(@GetUser() user: any, @Param('orderId') orderId: string) {
    return await this.ordersService.getOrderById(user.id, orderId);
  }

  // Simula Pagamento bem-sucedido
  @Post(':orderId/pay')
  async processPayment(@Param('orderId') orderId: string) {
    return this.ordersService.processPayment(orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
    @GetUser() user: any,
  ) {
    return this.ordersService.updateOrderStatus(orderId, status, user.id);
  }

  @Post(':orderId/refund/request')
  async requestRefund(@Param('orderId') orderId: string) {
    return this.ordersService.requestRefund(orderId);
  }

  @Put(':orderId/refund')
  async processRefund(
    @Param('orderId') orderId: string,
    @Body('approve') approve: boolean,
    @Body('userRole') userRole: UserRole,
  ) {
    return this.ordersService.processRefund(orderId, approve, userRole);
  }
}
