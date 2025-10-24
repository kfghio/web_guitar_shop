import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { EventsService } from '../events/events.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly eventsService: EventsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private getAllBrandsKey(): string {
    return 'all_brands';
  }

  private getBrandKey(id: number): string {
    return `brand_${id}`;
  }

  private getBrandWithProductsKey(id: number): string {
    return `brand_with_products_${id}`;
  }

  private getPaginationKey(page: number, limit: number): string {
    return `brands_page_${page}_limit_${limit}`;
  }

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandRepository.create(createBrandDto);
    const result = await this.brandRepository.save(brand);

    await this.cacheManager.del(this.getAllBrandsKey());

    this.eventsService.emitEvent('brand-created', {
      name: brand.name,
      id: brand.id,
    });

    return result;
  }

  async findAll(): Promise<Brand[]> {
    const cacheKey = this.getAllBrandsKey();
    const cached = await this.cacheManager.get<Brand[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const brands = await this.brandRepository.find({ relations: ['products'] });
    await this.cacheManager.set(cacheKey, brands);
    return brands;
  }

  async findOne(id: number): Promise<Brand> {
    const cacheKey = this.getBrandKey(id);
    const cached = await this.cacheManager.get<Brand>(cacheKey);

    if (cached) {
      return cached;
    }

    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    await this.cacheManager.set(cacheKey, brand);
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    await this.brandRepository.update(id, updateBrandDto);

    await Promise.all([
      this.cacheManager.del(this.getBrandKey(id)),
      this.cacheManager.del(this.getAllBrandsKey()),
      this.cacheManager.del(this.getBrandWithProductsKey(id)),
    ]);

    this.eventsService.emitEvent('brand-updated', { id });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.brandRepository.delete(id);

    // Инвалидация кэша при удалении
    await Promise.all([
      this.cacheManager.del(this.getBrandKey(id)),
      this.cacheManager.del(this.getAllBrandsKey()),
      this.cacheManager.del(this.getBrandWithProductsKey(id)),
    ]);

    this.eventsService.emitEvent('brand-deleted', { id });
  }

  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[Brand[], number]> {
    const cacheKey = this.getPaginationKey(page, limit);
    const cached = await this.cacheManager.get<[Brand[], number]>(cacheKey);

    if (cached) {
      return cached;
    }

    const [brands, total] = await this.brandRepository.findAndCount({
      relations: ['products'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    await this.cacheManager.set(cacheKey, [brands, total]);
    return [brands, total];
  }

  async findOneWithProducts(id: number): Promise<Brand> {
    const cacheKey = this.getBrandWithProductsKey(id);
    const cached = await this.cacheManager.get<Brand>(cacheKey);

    if (cached) {
      return cached;
    }

    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    await this.cacheManager.set(cacheKey, brand);
    return brand;
  }
}
