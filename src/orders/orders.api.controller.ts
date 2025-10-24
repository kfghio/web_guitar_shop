import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  DefaultValuePipe,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginatedOrdersDto } from './dto/paginated-order.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateOrderItemDto } from '../order-items/dto/create-order-item.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@ApiTags('Orders - API')
@Controller('api/orders')
export class OrdersApiController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get('list')
  @ApiOperation({ summary: 'Получить список заказов с пагинацией' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Лимит записей на странице',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат списка заказов',
    type: PaginatedOrdersDto,
  })
  async findAll(
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('Page must be a number'),
      }),
    )
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(10),
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException('Limit must be a number'),
      }),
    )
    limit: number,
    @Req() request: Request,
  ) {
    const [orders, total] = await this.ordersService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const baseUrl = `${protocol}://${host}/api/orders`;

    return {
      data: orders,
      meta: { total, page, limit, totalPages },
      links: {
        prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
        next:
          page < totalPages
            ? `${baseUrl}?page=${page + 1}&limit=${limit}`
            : null,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат заказа',
    type: CreateOrderDto,
  })
  @ApiResponse({ status: 200, description: 'Заказ найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Создать новый заказ' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Обновить данные заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Заказ обновлен' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить заказ' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 204, description: 'Заказ удален' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get(':id/items')
  @ApiOperation({ summary: 'Получить элементы заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат заказа',
    type: [CreateOrderItemDto],
  })
  @ApiResponse({ status: 200, description: 'Список элементов заказа' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async getItems(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return order.items;
  }
}
