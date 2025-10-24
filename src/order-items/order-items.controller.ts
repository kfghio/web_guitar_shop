import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  NotFoundException,
  Sse,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { EventsService } from '../events/events.service';
import { map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('order-items')
export class OrderItemsController {
  constructor(
    private readonly orderItemsService: OrderItemsService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly eventsService: EventsService,
  ) {}
  @Sse('updates')
  productUpdates() {
    return this.eventsService.eventStream$.pipe(
      tap((msg) => console.log('Отправка SSE:', msg)),
      map((message) => ({ data: message })),
    );
  }

  @Post()
  @Redirect('/order-items/list')
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    await this.orderItemsService.create(createOrderItemDto);
    return {};
  }

  @Get('list')
  @Render('order-items/list')
  async findAll() {
    const orderItems = await this.orderItemsService.findAll();
    return {
      orderItems,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('add')
  @Render('order-items/add')
  @Redirect('/order-items/list')
  async showAddForm() {
    const [orders, products] = await Promise.all([
      this.ordersService.findAll(),
      this.productsService.findAll(),
    ]);
    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
      orders,
      products,
    };
  }

  @Get(':id/edit')
  @Render('order-items/edit')
  async showEditForm(@Param('id') id: string) {
    const orderItem = await this.orderItemsService.findOne(+id);
    if (!orderItem) throw new NotFoundException('Brand not found');
    return {
      orderItem,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/order-items/list')
  async update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(+id, updateOrderItemDto);
  }

  @Post(':id/delete')
  @Redirect('/order-items/list')
  async remove(@Param('id') id: string) {
    return this.orderItemsService.remove(+id);
  }
}
