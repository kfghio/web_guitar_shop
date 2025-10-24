import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  Sse,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from '../brands/brands.service';
import { CategoriesService } from '../categories/categories.service';
import { EventsService } from '../events/events.service';
import { map, tap } from 'rxjs';
import { ReviewsService } from '../reviews/reviews.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly eventsService: EventsService,
    private readonly reviewsService: ReviewsService,
  ) {}
  @Sse('updates')
  productUpdates() {
    return this.eventsService.eventStream$.pipe(
      tap((msg) => console.log('Отправка SSE:', msg)),
      map((message) => ({ data: message })),
    );
  }
  @Get(':id/details')
  @Render('products/details')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    if (!product) throw new NotFoundException('Product not found');
    return {
      product,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }
  @Get(':id/reviews/add')
  @Render('reviews/add')
  async showAddReviewForm(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    if (!product) throw new NotFoundException('Product not found');
    return {
      product,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }
  @Get('add')
  @Render('products/add')
  async showAddForm() {
    const [brands, categories] = await Promise.all([
      this.brandsService.findAll(),
      this.categoriesService.findAll(),
    ]);

    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      brands,
      categories,
    };
  }

  @Post()
  @Redirect('/products')
  async create(@Body() createProductDto: CreateProductDto) {
    await this.productsService.create(createProductDto);
  }

  @Get()
  @Render('products/list')
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      products,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('/electric')
  @Render('products/list')
  async showElectricGuitars() {
    const products = await this.productsService.findByCategory(1);
    return {
      products,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('/acoustic')
  @Render('products/list')
  async showAcousticGuitars() {
    const products = await this.productsService.findByCategory(2);
    return {
      products,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get(':id/edit')
  @Render('products/edit')
  async showEditForm(@Param('id') id: string) {
    const product = await this.productsService.findOne(+id);
    return {
      product,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/products')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productsService.update(+id, updateProductDto);
  }

  @Post(':id/delete')
  @Redirect('/products')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}
