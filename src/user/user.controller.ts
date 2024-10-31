import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { FindUserReqDto } from './dto/req.dto';
import { PageReqDto } from '../common/dto/req.dto';
import { ApiGetItemsResponse, ApiGetResponse } from '../common/decorater/swagger.decorator';
import { FindUserResDto } from './dto/res.dto';
import { PageResDto } from '../common/dto/res.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserAfterAuth } from '../common/decorater/user.decorator';
import { Roles } from '../common/decorater/role.decorator';
import { Role } from './enum/user.enum';
import { CreateDateColumn } from 'typeorm';
import { Public } from '../common/decorater/public.decorator';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(FindUserResDto, PageResDto)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Custom Swagger page response decorator
  @ApiGetItemsResponse(FindUserResDto)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() { page, size }: PageReqDto, @User() user: UserAfterAuth): Promise<FindUserResDto[]> {
    const users = await this.userService.findAll(page, size);
    return users.map(({ id, email, createdAt }) => {
      return { id, email, createdAt: createdAt.toISOString() };
    });
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  findOne(@Param() { id }: FindUserReqDto) {
    return this.userService.findOne(id);
  }

  @Public()
  @Post('bulk')
  createBulk() {
    return this.userService.createBulk();
  }
}
