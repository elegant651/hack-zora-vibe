/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io'],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(ts)x?$/, // Just `tsx?` file only
      use: [
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            onlyCompileBundledFiles: true,
          },
        },
      ],
    });
  
    return config;
  },
};
