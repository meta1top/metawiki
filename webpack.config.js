module.exports = (options, _webpack) => {
  const isProduction = options.mode === "production";

  return {
    ...options,

    /**
     * Source Map 配置说明:
     *
     * 开发环境: 'inline-source-map'
     * - 将 source map 内联到打包文件中
     * - 重建速度快,方便实时调试
     *
     * 生产环境: 'source-map'
     * - 生成独立的 .map 文件 (如 main.js.map)
     * - 优点:
     *   1. 主文件体积小,不影响加载速度
     *   2. 可以选择性部署 .map 文件(不对外暴露源码)
     *   3. 通过错误监控工具(如 Sentry)上传 source map,实现安全的错误追踪
     *
     * 其他可选方案:
     * - 'hidden-source-map': 生成 .map 但不在主文件中添加引用注释(更安全)
     * - 'nosources-source-map': 不包含源码内容,仅映射行列号(最安全)
     * - false: 完全禁用 source map(最快但无法调试)
     */
    devtool: isProduction ? "source-map" : "inline-source-map",

    output: {
      ...options.output,
      // 配置 source map 中的文件路径
      devtoolModuleFilenameTemplate: (info) => {
        // 开发环境:使用绝对路径,方便 IDE 调试

        // 如果是外部模块,直接返回原路径
        if (info.resourcePath.startsWith("external ") || info.resourcePath.startsWith("webpack/")) {
          return info.resourcePath;
        }

        if (isProduction) {
          return info.relativePath;
        } else {
          // 开发环境:使用真实的绝对路径
          return info.absoluteResourcePath;
        }
      },
    },

    // 生产环境额外配置
    ...(isProduction && {
      optimization: {
        ...options.optimization,
        // 启用代码压缩
        minimize: true,
        // 保持有意义的模块名和函数名,便于堆栈追踪
        moduleIds: "deterministic",
      },
    }),
  };
};

/**
 * Source Map 路径配置说明:
 *
 * 重要:已移除 source-map-support 包,改用 Node.js 原生 source map 支持
 * - source-map-support 会强制拼接运行目录前缀,导致路径混乱
 * - Node.js 原生支持(--enable-source-maps)能正确处理各种路径格式
 *
 * 开发环境:
 * - 使用绝对路径: /Users/grant/Prime/dev/prime-dev/libs/account/src/service/account.service.ts
 * - 好处: Node.js 可以直接定位到源文件,方便 IDE 跳转和调试
 * - 错误堆栈清晰: 直接显示源文件真实路径
 *
 * 生产环境:
 * - 使用 webpack:// 协议: webpack://prime-dev/libs/account/src/service/account.service.ts
 * - 好处: 不暴露服务器文件系统结构,保护隐私
 * - 配合监控平台: Sentry/Datadog 等可以正确解析 webpack:// 协议
 * - Node.js 原生支持会正确显示此路径,不会拼接前缀
 *
 * 生产环境 Source Map 最佳实践:
 *
 * 1. 私有部署 (推荐):
 *    - 将 .map 文件部署到私有服务器或对象存储
 *    - 不在公网暴露 source map
 *    - Node.js 运行时自动读取同目录下的 .map 文件
 *
 * 2. 错误监控服务:
 *    - 使用 Sentry/Datadog 等服务
 *    - 构建时上传 source map 到监控平台
 *    - 生产环境删除 .map 文件,通过平台还原堆栈
 *
 * 3. 条件加载:
 *    - 使用 'hidden-source-map' 生成 .map 但不添加引用
 *    - 需要时通过 --enable-source-maps 启动 Node.js
 *
 * 4. 启用 Node.js source map 支持:
 *    使用 Node.js 内置支持(Node 12.12.0+,推荐):
 *      启动命令: NODE_OPTIONS='--enable-source-maps' node dist/apps/server/main.js
 *      或在 package.json 中配置环境变量
 *
 *    ⚠️  不推荐使用 source-map-support 包:
 *      - 会强制拼接运行目录前缀,导致路径混乱
 *      - 对 webpack:// 等协议路径处理不当
 */
