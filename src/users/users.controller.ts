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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { map, tap } from 'rxjs';
import { EventsService } from '../events/events.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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
  @Redirect('/users/list')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
    return {};
  }

  @Get('list')
  @Render('users/list')
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      users,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get('add')
  @Render('users/add')
  @Redirect('/users/list')
  showAddForm() {
    return {
      title: 'Добавление товара',
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Get(':id/edit')
  @Render('users/edit')
  async showEditForm(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('Brand not found');
    return {
      user,
      cssFile: 'accoustic.css',
      additionalScripts: ['/scripts/shSSE.js'],
    };
  }

  @Post(':id/update')
  @Redirect('/users/list')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Post(':id/delete')
  @Redirect('/users/list')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
