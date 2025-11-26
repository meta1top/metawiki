import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AppError } from "@meta-1/nest-common";
import { NacosConfigService } from "@meta-1/nest-nacos";
import { Public } from "@meta-1/nest-security";
import { CommonConfig } from "@meta-1/wiki-types";
import { CommonConfigDto } from "../dto";
import { AppConfig, ErrorCode } from "../shared";

@ApiTags("ConfigController")
@Controller("/api/config")
export class ConfigController {
  constructor(private readonly nacosConfigService: NacosConfigService) {}

  @Public()
  @Get("/common")
  @ApiOperation({ summary: "获取公共配置", description: "获取公共配置" })
  @ApiResponse({
    status: 200,
    description: "获取公共配置成功",
    type: CommonConfigDto,
  })
  async common(): Promise<CommonConfig> {
    const config = this.nacosConfigService.get<AppConfig>();
    if (!config) {
      throw new AppError(ErrorCode.COMMON_CONFIG_NOT_FOUND);
    }
    const { account } = config;
    return {
      publicKey: account.publicKey,
    };
  }
}
