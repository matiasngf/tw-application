## Programming with emojis 🤖

You are here! That's great; let's continue down the rabbit hole.

`emojs` is an esoteric language that I created to experiment with a few technologies. It follows the same rules as `javascript`, so it can be transpiled and run by `nodejs`.

If you navigate to [/app/application/src/transpiled](./src/transpiled), you will find `.emojs` files.

Of course, I didn't write the actual code with emojis. I created a folder [to-transpile](./src/transpiled) that contains the original code in typescript. Then, I used a `transpiler` to translate my code from typescript into emojis.

Finally, the `.emojs` files are used all across the application. For example, [lerp.emojs](./src/transpiled/lerp.emojs) is imported in the file [eye.tsx](./src/app/sections/hero/eye.tsx).

Emojs users like to have their code typed, so the transpiler also generates `.d.ts` files to keep the type information, so each time you import a `.emojs` file, you get the correct types.

But why does it work? NextJs uses Webpack to bundle the code, so I created a `Webpack loader` that can transpile `emojs` code into `javascript`.

## In-depth

This experiment is divided into three parts:

### Parser

[Source: /packages/parser](../../packages/parser/)

The main functionality for translating the code is in the parser. It first `tokenizes` the code, recognizing keywords that need to be translated. \*\*It doesn't create an AST, but it gets the job done. It can distinguish between keywords, comments, and strings to avoid translating the wrong parts of code.

| ⚠️ Support for template literals is still missing.

### Transpiler

[Soruce: /packages/transpiler](../../packages/transpiler/)

The transpiler is a `CLI` that can be used to translate an entire folder of files from `typescript` to `emojs`. It contains some options to customize its behavior.

It uses the typescript compiler behind the scenes to parse the code, it also emits `d.ts` files to keep the type information.

Example of usage:

```jsonc
// /app/application/package.json
{
  "scripts": {
    "emojs-generate": "emojs-compiler build --input './src/to-transpile' --output './src/transpiled'",
    "emojs-watch": "emojs-compiler dev -D -W --input './src/to-transpile' --output './src/transpiled'",
  },
  "devDependencies": {
    "@tw-application/transpiler": "workspace:^0.0.0",
  },
}
```

### Loader

[Source: /packages/emojs-loader](../../packages/emojs-loader/)

In order to run your emoji code properly, you'll need the `emojs-loader`. This is a `webpack loader` that follows the [standard webpack boilerplate](https://github.com/webpack-contrib/webpack-defaults).

It can transpile `emojs` code into `javascript` and vice versa.

Usage with nextjs:

```bash
npm install -D emojs-loader
```

_(The package is not published yet, so you'll need to install it from the root of the monorepo.)_

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    // add Support for .emojs files
    config.module.rules.push({
      test: /\.emojs$/,
      use: [
        "babel-loader",
        {
          loader: "emojs-loader",
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
```
