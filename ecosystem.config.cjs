module.exports = {
  apps: [
    {
      name: "FE",
      script: "npx",
      // FE là SPA build tĩnh, không cần nginx để serve — dùng `serve` với fallback SPA
      args: "serve -s dist -l 3000",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
