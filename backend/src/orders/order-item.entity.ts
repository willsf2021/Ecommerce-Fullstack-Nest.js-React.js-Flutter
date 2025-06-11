import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  productId: string; // (brazilian-1 / european-1)

  @Column()
  productName: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'integer' })
  quantity: number;
}
