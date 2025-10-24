import { Controller, Sse } from '@nestjs/common';
import { EventsService } from './events.service';
import { map, tap } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('updates')
  productUpdates() {
    console.log('Updating events');
    return this.eventsService.eventStream$.pipe(
      tap((msg) => console.log('Отправка SSE:', msg)),
      map((message) => ({ data: message })),
    );
  }
}
