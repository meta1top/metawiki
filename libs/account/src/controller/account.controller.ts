import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { md5 } from "@meta-1/nest-common";
import { CurrentUser, Public, SessionService, type SessionUser } from "@meta-1/nest-security";
import { LoginDto, RegisterDto } from "../dto";
import { AccountService } from "../service";

@ApiTags("AccountController")
@Controller("/api/account")
export class AccountController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly accountService: AccountService,
  ) {}

  @Get("/profile")
  profile(@CurrentUser() user: SessionUser) {
    return this.accountService.findByEmail(user.username);
  }

  @Public()
  @Post("/register")
  register(@Body() dto: RegisterDto) {
    return this.accountService.register(dto);
  }

  @Post("/logout")
  logout(@CurrentUser() user: SessionUser) {
    return this.sessionService.logout(md5(user.jwtToken));
  }

  @Public()
  @Post("/login")
  login(@Body() dto: LoginDto) {
    return this.accountService.login(dto);
  }
}
