import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CurrentUser, type SessionUser } from "@meta-1/nest-security";
import { OTPDisableDto, OTPEnableDto, OTPSecretDto, OTPStatusDto } from "../dto";
import { AccountOTPService } from "../service";

@ApiTags("AccountOTPController")
@Controller("/api/account/otp")
export class AccountOTPController {
  constructor(private readonly accountOTPService: AccountOTPService) {}

  @Get("/status")
  @ApiOperation({ summary: "获取 OTP 状态" })
  @ApiResponse({
    status: 200,
    description: "获取 OTP 状态成功",
    type: OTPStatusDto,
  })
  status(@CurrentUser() user: SessionUser) {
    return this.accountOTPService.status(user.id);
  }

  @Get("/secret")
  @ApiOperation({ summary: "获取 OTP 密钥" })
  @ApiResponse({
    status: 200,
    description: "获取 OTP 密钥成功",
    type: OTPSecretDto,
  })
  secret(@CurrentUser() user: SessionUser) {
    return this.accountOTPService.secret(user.id);
  }

  @Post("/enable")
  @ApiOperation({ summary: "启用 OTP" })
  enable(@CurrentUser() user: SessionUser, @Body() body: OTPEnableDto) {
    return this.accountOTPService.enable(user.username, body);
  }

  @Post("/disable")
  @ApiOperation({ summary: "禁用 OTP" })
  disable(@CurrentUser() user: SessionUser, @Body() body: OTPDisableDto) {
    return this.accountOTPService.disable(user.username, body);
  }
}
