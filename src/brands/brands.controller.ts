import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  NotFoundException,
  Redirect,
  Sse,
  UseFilters,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { EventsService } from '../events/events.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { UnauthorizedRedirectFilter } from '../auth/unauthorized-redirect.filter';

@ApiExcludeController()
@UseFilters(UnauthorizedRedirectFilter)
@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly eventsService: EventsService,
  ) {}

  @Sse('updates')
  productUpdates() {
    return this.eventsService.eventStream$;
  }

  @Post()
  @Redirect('/brands/list')
  async create(@Body() createBrandDto: CreateBrandDto) {
    await this.brandsService.create(createBrandDto);
    return {};
  }

  @Get('list')
  @Render('brands/list')
  async findAll() {
    const brands = await this.brandsService.findAll();
    return {
      brands,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('add')
  @Render('brands/add')
  @Redirect('/brands/list')
  showAddForm() {
    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get(':id/edit')
  @Render('brands/edit')
  async showEditForm(@Param('id') id: string) {
    const brand = await this.brandsService.findOne(+id);
    if (!brand) throw new NotFoundException('Brand not found');
    return {
      brand,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/brands/list')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Post(':id/delete')
  @Redirect('/brands/list')
  async remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
