import { Injectable, Logger } from "@nestjs/common";
import { VideoService } from "../video/video.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EmailService } from "../email/email.service";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly videoService: VideoService,
    private readonly emailService: EmailService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_10AM)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleEmailCron() {
    const videos = await this.videoService.findTop5Download();
    this.emailService.send(videos);
  }

}
