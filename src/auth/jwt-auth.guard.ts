import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Inject, Injectable, Logger, LoggerService, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../common/decorater/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/enum/user.enum';
import { ROLES_KEY } from '../common/decorater/role.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector, // 메타데이터를 가져오는 Reflector 인스턴스
    private jwtService: JwtService, // JWT 서비스로, 토큰을 디코딩 및 검증에 사용
    private userService: UserService, // UserService로 역할 확인과 사용자 정보 검색에 사용
    @Inject(Logger) private logger: LoggerService, // Logger를 사용해 에러 메시지 로깅
  ) {
    super(); // 부모 클래스 AuthGuard('jwt')를 초기화하여 기본 JWT 인증 사용
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 1. @Public 데코레이터를 사용한 경로인지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true; // 공개 경로이면 인증 없이 접근 허용

    // 2. 요청의 URL과 헤더에서 JWT 토큰을 추출하여 디코딩
    const http = context.switchToHttp();
    const { url, headers } = http.getRequest<Request>();
    const token = /Bearer\s(.+)/.exec(headers['authorization'])[1]; // 헤더에서 Bearer 토큰 추출
    const decoded = this.jwtService.decode(token); // 토큰을 디코딩하여 페이로드 추출

    // 3. URL이 /api/auth/refresh가 아니고 토큰 타입이 refresh일 경우 예외 처리
    if (url !== '/api/auth/refresh' && decoded['tokenType'] === 'refresh') {
      const error = new UnauthorizedException('accessToken is required');
      this.logger.error(error.message, error.stack); // 에러 메시지와 스택 로그 출력
      throw error; // 예외 발생으로 접근 거부
    }

    // 4. 경로에 필요한 역할이 지정된 경우 역할 확인
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 5. 필요한 역할이 있는 경우, 현재 사용자가 ADMIN인지 확인
    if (requiredRoles) {
      const userId = decoded['sub']; // 토큰에서 사용자 ID 추출
      return this.userService.checkUserIsAdmin(userId); // ADMIN 역할 여부를 확인
    }

    // 6. 위 조건에 해당하지 않으면 기본 JWT 인증 절차 수행
    return super.canActivate(context);
  }
}
