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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductsDto } from './dto/paginated-product.dto';
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
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@ApiTags('Products - API')
@Controller('api/products')
export class ProductsApiController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get('list')
  @ApiOperation({ summary: 'Получить список товаров с пагинацией' })
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
    description: 'Успешный возврат списка товаров',
    type: PaginatedProductsDto,
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
    const [products, total] = await this.productsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const baseUrl = `${protocol}://${host}/api/products`;

    return {
      data: products,
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
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат товара с полной информацией',
    schema: {
      example: {
        id: 7,
        sku: '3',
        name: 'Test19',
        description: 'Test',
        price: '1000.02',
        stock: 5,
        imageUrl: null,
        category: {
          id: 1,
          name: 'electro',
          description: 'instrument',
        },
        brand: {
          id: 1,
          name: 'Fender',
          logoUrl: '1',
        },
        reviews: [
          {
            id: 14,
            rating: 2,
            comment: 'rrr',
            createdAt: '2025-03-29T14:54:18.367Z',
          },
          {
            id: 15,
            rating: 2,
            comment: 'rrr',
            createdAt: '2025-03-29T14:54:59.946Z',
          },
        ],
        orderItems: [
          {
            id: 8,
            quantity: 121212,
            price: '34.01',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Невалидный ID товара',
    schema: {
      example: {
        statusCode: 400,
        message: 'ID must be a number',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Обновить данные товара' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Товар обновлен' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiResponse({ status: 204, description: 'Товар удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get(':id/reviews')
  @ApiOperation({ summary: 'Получить отзывы о товаре' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат списка отзывов',
    schema: {
      example: [
        {
          id: 14,
          rating: 2,
          comment: 'rrr',
          createdAt: '2025-03-29T14:54:18.367Z',
        },
        {
          id: 15,
          rating: 2,
          comment: 'rrr',
          createdAt: '2025-03-29T14:54:59.946Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 200, description: 'Список отзывов' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getReviews(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return product.reviews;
  }
}
