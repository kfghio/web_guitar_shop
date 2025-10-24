import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly eventsService: EventsService,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create({
      ...createOrderItemDto,
      product: { id: createOrderItemDto.productId },
      order: { id: createOrderItemDto.orderId },
    });

    const savedOrderItem = await this.orderItemRepository.save(orderItem);
    this.eventsService.emitEvent('orderItem-created', {
      id: savedOrderItem.id,
    });
    return this.orderItemRepository.save(savedOrderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({
      relations: ['order', 'product'],
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Order item #${id} not found`);
    }
    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    await this.orderItemRepository.update(id, updateOrderItemDto);
    this.eventsService.emitEvent('orderItem-updated', {
      id: id,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderItemRepository.delete(id);
    this.eventsService.emitEvent('orderItem-deleted', {
      id: id,
    });
  }
  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[OrderItem[], number]> {
    return this.orderItemRepository.findAndCount({
      relations: ['order', 'product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }
}
