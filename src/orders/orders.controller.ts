import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  NotFoundException, Sse,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
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
  @Redirect('/orders/list')
  async create(@Body() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto);
    return {};
  }

  @Get('list')
  @Render('orders/list')
  async findAll() {
    const orders = await this.ordersService.findAll();
    return {
      orders,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('add')
  @Render('orders/add')
  @Redirect('/orders/list')
  async showAddForm() {
    const [users] = await Promise.all([this.usersService.findAll()]);
    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
      users,
    };
  }

  @Get(':id/edit')
  @Render('orders/edit')
  async showEditForm(@Param('id') id: string) {
    const order = await this.ordersService.findOne(+id);
    if (!order) throw new NotFoundException('Brand not found');
    return {
      order,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/orders/list')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Post(':id/delete')
  @Redirect('/orders/list')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
