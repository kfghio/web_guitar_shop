import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly eventsService: EventsService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    if (createProductDto.price < 1000) {
      throw new Error('Цена не может быть меньше 1000 рублей');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category: { id: createProductDto.categoryId },
      brand: { id: createProductDto.brandId },
    });

    const savedProduct = await this.productRepository.save(product);

    this.eventsService.emitEvent('product-created', savedProduct);

    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'brand', 'reviews', 'orderItems'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'brand', 'reviews', 'orderItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updatedProduct = await this.findOne(id);

    this.eventsService.emitEvent('product-updated', updatedProduct);

    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);

    this.eventsService.emitEvent('product-deleted', {
      id: id,
    });
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'brand'],
    });
  }

  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[Product[], number]> {
    return this.productRepository.findAndCount({
      relations: ['category', 'brand', 'reviews', 'orderItems'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }
}
