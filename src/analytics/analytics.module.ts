import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ScheduleModule } from "@nestjs/schedule";
import { VideoModule } from "../video/video.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [ScheduleModule.forRoot(), VideoModule, EmailModule],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
