import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppError } from "@meta-1/nest-common";
import { ACCOUNT_CONFIG, type AccountConfig, ErrorCode } from "../shared";

/**
 * Account 配置服务
 * 用于读取和保存 AccountModule 的配置
 */
@Injectable()
export class AccountConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 保存配置
   */
  set(config: AccountConfig) {
    this.configService.set(ACCOUNT_CONFIG, config);
  }

  /**
   * 获取当前配置
   */
  get<T = AccountConfig>(): T {
    const config = this.configService.get<T>(ACCOUNT_CONFIG);
    if (!config) {
      throw new AppError(ErrorCode.ACCOUNT_CONFIG_NOT_FOUND);
    }
    return config;
  }
}
