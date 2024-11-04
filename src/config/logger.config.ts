import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { registerAs } from '@nestjs/config';
import process from 'node:process';

const loggerLevel = process.env.STAGE === 'prod' ? 'info' : 'debug';
// const loggerLevel = 'debug';

const loggerFormatter = winston.format.combine(
  winston.format.timestamp(),
  nestWinstonModuleUtilities.format.nestLike('NestJS', {
    colors: true,
    prettyPrint: true,
    appName: true, // appName을 출력하려면 true로 설정!!
  }),
);

const loggerSetting = {
  // level 은 출력은 안되지만 winston의 loggin level은 지켜지고 있음
  // 왜 출력이 안될까??
  level: loggerLevel,
  format: loggerFormatter,
};

export default registerAs('logger', () => ({
  transports: [new winston.transports.Console(loggerSetting)],
}));
