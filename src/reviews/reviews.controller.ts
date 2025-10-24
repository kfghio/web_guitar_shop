import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  NotFoundException,
  Redirect,
  Sse,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ProductsService } from '../products/products.service';
import { map, tap } from 'rxjs';
import { EventsService } from '../events/events.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
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
  @Redirect('/products')
  async create(@Body() createReviewDto: CreateReviewDto) {
    await this.reviewsService.create(createReviewDto);
  }
  @Delete(':id')
  @Get('add/:productId')
  @Render('reviews/add')
  async showAddForm(@Param('productId') productId: string) {
    const product = await this.productsService.findOne(+productId);
    if (!product) throw new NotFoundException('Product not found');
    return {
      product,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Get(':id/edit')
  @Render('reviews/edit')
  async showEditForm(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(+id);
    if (!review) throw new NotFoundException('Review not found');
    return {
      review,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/products')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Post(':id/delete')
  @Redirect('/products')
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
