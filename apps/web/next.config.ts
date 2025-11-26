import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

export default {
  output: "standalone",
  reactStrictMode: false,
  trailingSlash: false,
  transpilePackages: ["@meta-1/design", "@meta-1/editor"],
  compiler: {
    removeConsole: !isDev,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
} as NextConfig;
