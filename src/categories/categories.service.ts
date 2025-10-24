import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly eventsService: EventsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    this.eventsService.emitEvent('category-created', {
      name: category.name,
      id: category.id,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    this.eventsService.emitEvent('category-updated', {
      id: id,
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    this.eventsService.emitEvent('category-deleted', {
      id: id,
    });
    await this.categoryRepository.delete(id);
  }
  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[Category[], number]> {
    return this.categoryRepository.findAndCount({
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }

  async findOneWithProducts(id: number): Promise<Category> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }
}
