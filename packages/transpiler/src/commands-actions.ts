
import chalk from 'chalk';
import { Logger } from './debugger';
import { EmoJSCompiler } from './compiler';

export const dev = (reverse: boolean, inputDir: string, outDir: string, debug: boolean, watch: boolean) => {

  Logger.setDebugMode(debug);

  const compiler = new EmoJSCompiler({
    reverse,
    dev: true,
    watch,
    matchPattern: inputDir + '/**/*.ts',
    outDir,
    onStart: () => {
      console.log(`${chalk.green('emojs-compiler')} starting dev mode`);
    }
  })

  compiler.start()

}

export const build = (reverse: boolean, inputDir: string, outDir: string, debug: boolean) => {

  Logger.setDebugMode(debug);

  const compiler = new EmoJSCompiler({
    reverse,
    dev: false,
    watch: false,
    matchPattern: inputDir + '/**/*.ts',
    outDir,
    onStart: () => {
      console.log(`${chalk.green('emojs-compiler')} starting`);
    }
  })

  compiler.start()

}
