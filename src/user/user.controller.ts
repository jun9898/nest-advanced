import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
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
  findAll(@Query() { page, size }: PageReqDto, @User() user: UserAfterAuth) {
    console.log(user);
    return this.userService.findAll();
  }

  @ApiGetResponse(FindUserResDto)
  @Get(':id')
  findOne(@Param() { id }: FindUserReqDto) {
    return this.userService.findOne(id);
  }
}
