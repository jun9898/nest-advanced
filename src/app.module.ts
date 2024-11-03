import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import postgresConfig from './config/postgres.config';
import jwtConfig from './config/jwt.config';
import * as console from 'node:console';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { WinstonModule } from 'nest-winston';
import loggerConfig from './config/logger.config';
import swaggerConfig from './config/swagger.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { EmailModule } from './email/email.module';
import sentryConfig from './sentry.config';
import EmailConfig from "./config/email.config";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, jwtConfig, swaggerConfig, loggerConfig, sentryConfig, EmailConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let obj: TypeOrmModuleOptions = {
          type: 'postgres',
          host: configService.get('postgres.host'),
          port: configService.get('postgres.port'),
          database: configService.get('postgres.database'),
          username: configService.get('postgres.username'),
          password: configService.get('postgres.password'),
          autoLoadEntities: true,
          synchronize: false,
        };
        if (configService.get('STAGE') === 'local') {
          console.info('Sync postgres');
          obj = Object.assign(obj, {
            // logging: true,
          });
        }
        return obj;
      },
    }),
    AuthModule,
    UserModule,
    VideoModule,
    AnalyticsModule,
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const loggerConfig = configService.get('logger');
        return {
          ...loggerConfig,
        };
      },
    }),
    HealthModule,
    EmailModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
