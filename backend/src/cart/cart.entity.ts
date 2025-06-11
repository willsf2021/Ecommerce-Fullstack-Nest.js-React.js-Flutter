// src/cart/cart.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { User } from '../users/user.entity';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com o usuário
  @ManyToOne(() => User, user => user.carts, { eager: true })
  user: User;

  // Itens associados ao carrinho
  @OneToMany(() => CartItem, item => item.cart, { cascade: true, eager: true })
  items: CartItem[];

  // Você pode adicionar campos como data de criação, status, etc.
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
