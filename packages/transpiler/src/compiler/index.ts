import chokidar from 'chokidar';
import * as fs from 'fs';
import { deleteSync } from 'del'
import { transpile } from './transpile';
import { Logger } from '../debugger';
import chalk from 'chalk';

export interface CompilerOptions {
  dev: boolean;
  watch: boolean;
  matchPattern?: string;
  outDir: string;
  reverse: boolean;
  onStart?: () => void;
}

export class EmoJSCompiler {
  /** If reverse, it will transpile form emojs back into JS */
  public reverse: boolean;
  /** Is the compiler in dev mode */
  public dev: boolean;
  /** Is the compiler watching for changes */
  public watch: boolean;
  /** A directory used by the compiler to output custom files */
  public matchPattern: string;
  /** Where to output the dist files */
  public outputDir: string;
  /** Is the compiler running */
  public running = false;
  /** The scene pahts */
  public pathList: string[] = [];
  /** Chalk watcher */
  private watcher?: chokidar.FSWatcher;
  /** Is the watcher ready with the initial loading */
  private watcherReady = false;
  /** Is the compiler generating code */
  private generatingCode = false;
  /** On start callback */
  onStart?: () => void;

  constructor(params: CompilerOptions) {
    this.dev = params.dev;
    this.watch = params.watch;
    this.matchPattern = params.matchPattern || "./src/original-hooks/**/*.ts";
    this.outputDir = params.outDir || "./src/hooks";
    this.onStart = params.onStart;
    this.reverse = params.reverse;
  }


  /** (re)generates the compiler directory */
  private cleanCompileDir() {
    if (fs.existsSync(this.outputDir)) {
      deleteSync(`${this.outputDir}/**`);
    } else {
      fs.mkdirSync(this.outputDir);
    }
  }

  public async start() {
    if (this.running) {
      return;
    }

    if (this.onStart) {
      console.clear()
      this.onStart();
    }
    this.running = true;
    this.cleanCompileDir();
    await this.getRoutes(this.watch);
  }

  public async getRoutes(watch: boolean): Promise<string[]> {
    return new Promise((resolve) => {
      this.watcherReady = false
      this.pathList = []
      const watcher = chokidar.watch(this.matchPattern, {
        ignored: /(^|[\/\\])\../,
        persistent: true
      });
      this.watcher = watcher;
      watcher
        .on('add', path => {
          this.pathList.push(path)
          if (this.watcherReady) {
            this.generateCode()
          }
        })
        .on("change", (path) => {
          if (this.watcherReady) {
            this.generateCode([path])
          }
        })
        .on('ready', async () => {
          this.watcherReady = true;
          if (!watch) {
            watcher.close();
          }
          await this.generateCode()
          resolve(this.pathList)
        })
      if (watch) {
        // handle file deletions
        watcher.on('unlink', path => {
          const index = this.pathList.indexOf(path);
          if (index !== -1) {
            this.pathList.splice(index, 1);
          }
          this.generateCode()
        })
      }
    })
  }

  private async generateCode(pathList: string[] | null = null) {
    const pathsToCompile = pathList ? pathList : this.pathList;
    this.generatingCode = true;
    const fileString = pathsToCompile.length === 1 ? "file" : "files";
    const startTime = Date.now();
    Logger.log(chalk.yellow(`Transpiling ${pathsToCompile.length} ${fileString}`))
    Logger.log(chalk.gray(pathsToCompile.join("\n")))
    transpile(this.outputDir, pathsToCompile)
    const duration = Date.now() - startTime;
    Logger.log(chalk.green(`Transpiled ${pathsToCompile.length} ${fileString} in ${duration}ms`))
    this.generatingCode = false;
  }
}
