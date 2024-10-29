import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorater/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/enum/user.enum';
import { ROLES_KEY } from '../common/decorater/role.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService, private userService: UserService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();
    const token = /Bearer\s(.+)/.exec(headers['authorization'])[1];
    const decoded = this.jwtService.decode(token);

    if (url !== '/api/auth/refresh' && decoded['tokenType'] === 'refresh') {
      console.log('accessToken is required');
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      const userId = decoded['sub'];
      return this.userService.checkUserIsAdmin(userId);
    }

    return super.canActivate(context);
  }
}
