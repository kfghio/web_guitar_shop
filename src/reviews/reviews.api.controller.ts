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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginatedReviewsDto } from './dto/paginated-review.dto';
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
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesDecorator } from '../auth/roles.decorator';

@ApiTags('Reviews - API')
@Controller('api/reviews')
export class ReviewsApiController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Get('list')
  @ApiOperation({ summary: 'Получить список отзывов с пагинацией' })
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
    description: 'Успешный возврат списка отзывов',
    type: PaginatedReviewsDto,
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
    const [reviews, total] = await this.reviewsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    const protocol = request.headers['x-forwarded-proto'] || 'http';
    const host = request.headers.host;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const baseUrl = `${protocol}://${host}/api/reviews`;

    return {
      data: reviews,
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
  @ApiOperation({ summary: 'Получить отзыв по ID' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({
    status: 200,
    description: 'Успешный возврат отзыва',
    type: CreateReviewDto,
  })
  @ApiResponse({ status: 200, description: 'Отзыв найден' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Создать новый отзыв' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Отзыв успешно создан' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Обновить данные отзыва' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Отзыв обновлен' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(FirebaseAuthGuard)
  @RolesDecorator('admin')
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({ status: 204, description: 'Отзыв удален' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reviewsService.remove(id);
  }
}
