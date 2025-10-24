import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class EventsService {
  private eventStream = new ReplaySubject<{ type: string; data: any }>(1);

  emitEvent(type: string, data: any) {
    console.log('[Events] Emit:', type, data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.eventStream.next({ type, data: data });
  }

  get eventStream$() {
    return this.eventStream.asObservable();
  }
}