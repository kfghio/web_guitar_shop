import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  Render,
  NotFoundException,
  Sse,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { EventsService } from '../events/events.service';
import { map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @Redirect('/categories/list')
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    await this.categoriesService.create(createCategoryDto);
    return {};
  }

  @Get('list')
  @Render('categories/list')
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      categories,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('add')
  @Render('categories/add')
  @Redirect('/categories/list')
  showAddForm() {
    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get(':id/edit')
  @Render('categories/edit')
  async showEditForm(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(+id);
    if (!category) throw new NotFoundException('Brand not found');
    return {
      category,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/categories/list')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Post(':id/delete')
  @Redirect('/categories/list')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
