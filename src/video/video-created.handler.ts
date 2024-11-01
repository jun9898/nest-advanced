import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { VideoCreatedEvent } from './event/video-created.event';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventsHandler(VideoCreatedEvent)
export class VideoCreatedHandler implements IEventHandler<VideoCreatedEvent> {
  handle(event: VideoCreatedEvent): any {
    console.info('VideoCreatedEvent', event);
  }
}
