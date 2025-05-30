import type { NextConfig } from "next";

const fs = require("fs");
const path = require("path");

const isDev = process.env.NODE_ENV !== "production";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactProductionProfiling: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.ejg.hu",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
        protocol: "https",
      },
      {
        hostname:
          process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") ??
          "localhost",
        protocol: "https",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: process.env.IGNORE_BUILD_ERRORS === "true",
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  serverExternalPackages: ["pdfkit"],
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXTAUTH_URL + "/api/upload"],
      bodySizeLimit: 1024 * 1024 * 10, // 10MB
    },
  },
  allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
};

module.exports = withBundleAnalyzer(nextConfig);
