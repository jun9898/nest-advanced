import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @ApiPropertyOptional({ description: 'page number. default = 1', example: 1 })
  @Transform(params => Number(params.value))
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'date size. default = 20', example: 1 })
  @Transform(params => Number(params.value))
  @IsInt()
  size?: number = 20;
}