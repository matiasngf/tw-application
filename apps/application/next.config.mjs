import remarkGfm from 'remark-gfm'
import nextMdx from '@next/mdx'

const withMDX = nextMdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // enable mdx
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  webpack: (config, options) => {
    // add support for .emojs files
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

export default withMDX(nextConfig)
