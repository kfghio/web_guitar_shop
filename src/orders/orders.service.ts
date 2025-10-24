import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventsService: EventsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      user: { id: createOrderDto.userId },
    });

    const savedOrder = await this.orderRepository.save(order);
    this.eventsService.emitEvent('order-created', {
      id: savedOrder.id,
    });
    return this.orderRepository.save(savedOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user', 'items'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    this.eventsService.emitEvent('order-updated', {
      id: id,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    this.eventsService.emitEvent('order-deleted', {
      id: id,
    });
    await this.orderRepository.delete(id);
  }

  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[Order[], number]> {
    return this.orderRepository.findAndCount({
      relations: ['user', 'items'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }
}
