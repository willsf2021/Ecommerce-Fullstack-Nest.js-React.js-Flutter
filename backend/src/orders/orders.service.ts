import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from '../cart/cart.service';
import { OrderStatus } from './order.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { OrderResponseDto } from './dto/order-response.dto';
import { firstValueFrom } from 'rxjs';
import { UserRole } from 'src/users/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    private cartService: CartService,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  async createOrder(userId: string): Promise<OrderResponseDto> {
    const user = await this.usersService.findById(userId);
    const cartItems = await this.cartService.getCartItems(userId);

    if (cartItems.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    // Criar e salvar o pedido antes de adicionar itens
    const order = await this.orderRepository.save(
      this.orderRepository.create({
        user,
        status: OrderStatus.PENDING,
      }),
    );

    // Buscar nome e preço de cada produto e salvar itens
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const productDetails = await firstValueFrom(
          this.productsService.findOneByCompositeId(item.productId),
        );

        if (!productDetails) {
          throw new NotFoundException(`Product ${item.productId} not found.`);
        }

        return await this.orderItemRepository.save(
          this.orderItemRepository.create({
            productId: item.productId,
            productName: productDetails.name,
            price: productDetails.price,
            quantity: item.quantity,
            order,
          }),
        );
      }),
    );

    order.items = orderItems;
    await this.orderRepository.save(order);

    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      user: {
        id: order.user.id,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    };
  }

  // Listar pedidos do usuário autenticado
  async getOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items'],
    });
  }

  // Consultar um pedido específico
  async getOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user: { id: userId } },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found.`);
    }

    if (newStatus === OrderStatus.PAID) {
      throw new BadRequestException(
        `Orders cannot be marked as PAID manually. Use the payment endpoint instead.`,
      );
    }

    if (
      newStatus === OrderStatus.CANCELED &&
      order.status !== OrderStatus.PENDING
    ) {
      throw new BadRequestException(`Only PENDING orders can be canceled.`);
    }

    if (newStatus === OrderStatus.SHIPPED && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`Only admins can mark orders as SHIPPED.`);
    }

    order.status = newStatus;
    return await this.orderRepository.save(order);
  }

  async processPayment(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    if (order.status === OrderStatus.CANCELED) {
      throw new BadRequestException(`Order is canceled, you can't paid it.`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order ${orderId} is not in PENDING status.`,
      );
    }

    order.status = OrderStatus.PAID;
    return await this.orderRepository.save(order);
  }

  async requestRefund(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    if (order.status !== OrderStatus.PAID) {
      throw new BadRequestException(`Only PAID orders can request a refund.`);
    }

    order.status = OrderStatus.REFUND_REQUESTED;
    return await this.orderRepository.save(order);
  }

  async processRefund(
    orderId: string,
    approve: boolean,
    userId: string,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found.`);
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(`Only admins can approve refunds.`);
    }

    if (order.status !== OrderStatus.REFUND_REQUESTED) {
      throw new BadRequestException(
        `Refund can only be processed for REFUND_REQUESTED orders.`,
      );
    }

    order.status = approve ? OrderStatus.REFUNDED : OrderStatus.PAID;
    return await this.orderRepository.save(order);
  }
}
