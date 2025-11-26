import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppError, CacheableService, CacheEvict } from "@meta-1/nest-common";
import { MailCodeService } from "@meta-1/nest-message";
import { OTPService } from "@meta-1/nest-security";
import { OTPSecret, OTPStatus } from "@meta-1/wiki-types";
import { OTPDisableDto, OTPEnableDto } from "../dto";
import { Account } from "../entity";
import { ErrorCode } from "../shared";

@Injectable()
@CacheableService()
export class AccountOTPService {
  private readonly logger = new Logger(AccountOTPService.name);
  constructor(
    private readonly otpService: OTPService,
    private readonly mailCodeService: MailCodeService,
    @InjectRepository(Account) private repository: Repository<Account>,
  ) {}

  async status(id: string): Promise<OTPStatus> {
    const account = await this.repository.findOne({ where: { id, deleted: false } });
    this.logger.log(account?.otpStatus);
    return {
      enable: account?.otpStatus === 1,
      enableTime: account?.otpEnableTime?.getTime(),
    };
  }

  async secret(id: string): Promise<OTPSecret> {
    const account = await this.repository.findOne({ where: { id, deleted: false } });
    if (!account) {
      throw new AppError(ErrorCode.ACCOUNT_NOT_FOUND);
    }
    const secret = await this.otpService.getSecret(account.email);
    const qrcode = this.otpService.getQRCode(account.email, secret);
    return {
      secret,
      qrcode,
      username: account.email,
    };
  }

  @CacheEvict({ key: "account:#{0}" })
  async enable(username: string, body: OTPEnableDto) {
    const secret = await this.otpService.getCachedSecret(username);
    if (!secret) {
      throw new AppError(ErrorCode.OTP_SECRET_NOT_FOUND);
    }
    if (!(await this.mailCodeService.verify(username, "otp-enable", body.code))) {
      throw new AppError(ErrorCode.MAIL_CODE_ERROR);
    }
    if (!this.otpService.check(secret, body.otpCode)) {
      throw new AppError(ErrorCode.OTP_CODE_INVALID);
    }
    await this.otpService.deleteCachedSecret(username);
    // 更新账号状态
    await this.repository.update({ email: username, deleted: false }, { otpStatus: 1, otpEnableTime: new Date() });
  }

  @CacheEvict({ key: "account:#{0}" })
  async disable(username: string, body: OTPDisableDto) {
    if (!(await this.mailCodeService.verify(username, "otp-disable", body.code))) {
      throw new AppError(ErrorCode.MAIL_CODE_ERROR);
    }
    // 更新账号状态
    await this.repository.update({ email: username, deleted: false }, { otpStatus: 0, otpEnableTime: null });
  }
}
