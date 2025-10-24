import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UsePipes,
  ParseIntPipe,
  HttpCode,
  ValidationPipe,
  DefaultValuePipe,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginatedBrandsDto } from './dto/paginated-brand.dto';
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

@ApiTags('Brands - API')
@Controller('api/brands')
export class BrandsApiController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get('list')
  @ApiOperation({ summary: 'Получить список брендов с пагинацией' })
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
    description: 'Успешный возврат списка брендов',
    type: PaginatedBrandsDto,
  })
  @ApiResponse({ status: 200, description: 'Успешный возврат списка брендов' })
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
    const [brands, total] = await this.brandsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const baseUrl = `${protocol}://${host}/api/categories`;
    return {
      data: brands,
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
  @ApiOperation({ summary: 'Получить бренд по ID' })
  @ApiParam({ name: 'id', description: 'ID бренда' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат бренда с продуктами',
    schema: {
      example: {
        id: 1,
        name: 'Fender',
        logoUrl: '1',
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
          {
            id: 9,
            sku: '4',
            name: 'Yamaha2',
            description: '23323',
            price: '1234.00',
            stock: 50,
            imageUrl: null,
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Бренд найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Post('add')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Создать новый бренд' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: 'Бренд успешно создан' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Обновить данные бренда' })
  @ApiParam({ name: 'id', description: 'ID бренда' })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({ status: 200, description: 'Бренд обновлен' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить бренд' })
  @ApiParam({ name: 'id', description: 'ID бренда' })
  @ApiResponse({ status: 204, description: 'Бренд удален' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.brandsService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get(':id/products')
  @ApiOperation({ summary: 'Получить продукты бренда' })
  @ApiParam({ name: 'id', description: 'ID бренда' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат списка брендов',
    type: [CreateProductDto],
  })
  @ApiResponse({ status: 200, description: 'Список продуктов' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async getProducts(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOneWithProducts(id);
    return brand.products;
  }

  private getUrl(): string {
    return '/api/brands';
  }
}
