import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ProductsService } from '../products/products.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private productsService: ProductsService,
    private readonly eventsService: EventsService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const product = await this.productsService.findOne(
      createReviewDto.productId,
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      product: product,
    });

    review.createdAt = new Date();

    this.eventsService.emitEvent('review-created', {
      id: review.id,
      comment: review.comment,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    await this.reviewRepository.update(id, updateReviewDto);
    const updatedReview = await this.findOne(id);

    this.eventsService.emitEvent('review-updated', {
      id: updatedReview.id,
      comment: updatedReview.comment,
    });

    return updatedReview;
  }

  async remove(id: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    this.eventsService.emitEvent('review-deleted', {
      id: review.id,
      comment: review.comment,
    });

    await this.reviewRepository.remove(review);
  }

  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[Review[], number]> {
    return this.reviewRepository.findAndCount({
      relations: ['user', 'product'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }
}
