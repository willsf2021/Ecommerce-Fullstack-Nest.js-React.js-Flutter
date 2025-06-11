import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartItemDto } from '../common/dto/create-cart-item.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private usersService: UsersService,
  ) {}

  // Busca ou cria o carrinho para um usuário
  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { user: { id: userId } }});
    if (!cart) {
      const user = await this.usersService.findById(userId);
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  // Retorna todos os itens do carrinho de um usuário
  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.getOrCreateCart(userId);
    return cart.items;
  }

  // Adiciona ou atualiza um item no carrinho de um usuário
  async addCartItem(userId: string, createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cart = await this.getOrCreateCart(userId);
    let item = cart.items.find(i => i.productId === createCartItemDto.productId);
    if (item) {
      item.quantity += createCartItemDto.quantity;
    } else {
      item = this.cartItemRepository.create({
        productId: createCartItemDto.productId,
        quantity: createCartItemDto.quantity,
        cart,
      });
      cart.items.push(item);
    }
    await this.cartRepository.save(cart);
    return item;
  }

  // Atualiza a quantidade de um item específico
  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
      throw new NotFoundException(`Item with productId ${productId} not found.`);
    }
    item.quantity = quantity;
    await this.cartRepository.save(cart);
    return item;
  }

  // Remove um item do carrinho
  async removeCartItem(userId: string, productId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
      throw new NotFoundException(`Item with productId ${productId} not found.`);
    }
    cart.items = cart.items.filter(i => i.id !== item.id);
    await this.cartRepository.save(cart);
  }
}
