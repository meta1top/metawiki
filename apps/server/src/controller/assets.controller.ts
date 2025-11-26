import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AssetsService, PresignedUploadUrlRequestDto, PresignedUploadUrlResponseDto } from "@meta-1/nest-assets";
import { Public } from "@meta-1/nest-security";

/**
 * 资源服务控制器
 * 提供文件上传和下载的预签名 URL API 接口
 */
@ApiTags("AssetsController")
@Controller("/api/assets")
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Public()
  @Post("/upload/pre-sign")
  @ApiOperation({
    summary: "生成预签名上传 URL",
    description: "获取文件上传的预签名 URL，支持 S3 和 OSS",
  })
  async generateUploadUrl(@Body() body: PresignedUploadUrlRequestDto): Promise<PresignedUploadUrlResponseDto> {
    return this.assetsService.generatePresignedUploadUrl(body);
  }
}
