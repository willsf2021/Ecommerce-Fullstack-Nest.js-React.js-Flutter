import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ProductsModule, CartModule, OrdersModule],
  controllers: [AppController, ProductsController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {}
