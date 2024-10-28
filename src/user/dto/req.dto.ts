import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindUserReqDto {
  @ApiProperty({ required: true, example: '1'})
  @IsUUID()
  id: string;
}