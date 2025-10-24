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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginatedCategoriesDto } from './dto/paginated-category.dto';
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
import { CreateProductDto } from '../products/dto/create-product.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@ApiTags('Categories - API')
@Controller('api/categories')
export class CategoriesApiController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get('list')
  @ApiOperation({ summary: 'Получить список категорий с пагинацией' })
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
    description: 'Успешный возврат списка категорий',
    type: PaginatedCategoriesDto,
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
    const [categories, total] = await this.categoriesService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const baseUrl = `${protocol}://${host}/api/categories`;
    return {
      data: categories,
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
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({
    name: 'id',
    description: 'ID категории',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат категории с продуктами',
    schema: {
      example: {
        id: 1,
        name: 'electro',
        description: 'instrument',
        products: [
          {
            id: 7,
            sku: '3',
            name: 'Test19',
            description: 'Test',
            price: '1000.02',
            stock: 5,
            imageUrl: null,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Категория найдена' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Создать новую категорию' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Категория успешно создана' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Обновить данные категории' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Категория обновлена' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiResponse({ status: 204, description: 'Категория удалена' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get(':id/products')
  @ApiOperation({ summary: 'Получить продукты категории' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат списка категорий',
    type: [CreateProductDto],
  })
  @ApiResponse({ status: 200, description: 'Список продуктов' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async getProducts(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOneWithProducts(id);
    return category.products;
  }
}
