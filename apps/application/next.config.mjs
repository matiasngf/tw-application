/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {

    // console.log(options.defaultLoaders.babel);

    config.module.rules.push({
      test: /\.emojs$/,
      use: [
        "babel-loader",
        {
          loader: 'emojs-loader',
        },
      ]
    })

    return config
  }
};

export default nextConfig;
