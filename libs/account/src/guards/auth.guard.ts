import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

import { AppError, ErrorCode } from "@meta-1/nest-common";
import { IS_PUBLIC_KEY, SessionService } from "@meta-1/nest-security";


import "./auth.guard.types";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公开接口，直接允许访问
    if (isPublic) {
      return true;
    }

    // 获取请求对象
    const request = context.switchToHttp().getRequest<Request>();

    // 从 Authorization header 获取 token
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(ErrorCode.UNAUTHORIZED);
    }

    const tokenHash = authHeader.substring(7);

    // 验证 token 并获取用户信息
    const user = await this.sessionService.get(tokenHash);
    if (!user) {
      throw new AppError(ErrorCode.UNAUTHORIZED);
    }

    // 设置用户信息到 request，供后续使用
    request.user = user;

    return true;
  }
}
