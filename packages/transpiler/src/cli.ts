import { Command } from "commander";
import { build, dev } from "./commands-actions";

const program = new Command();

program
  .name("compiler")
  .description("emojs compiler")
  .version("0.0.1")

program.command("build")
  .option('-I, --input <dir>', 'Input folder')
  .option('-O, --output <dir>', 'Output folder', 'dist')
  .option('-D, --debug', 'output extra debugging')
  .option('-R, --reverse', 'Transpiles from emojs back into boring js')
  .action((options) => {
    if (!options.input) {
      console.error("Please provide an input folder")
      process.exit(1)
    }
    const debug = !!options.debug;
    build(options.reverse, options.input, options.output, debug)
  })

program.command("dev")
  .option('-I, --input <dir>', 'Input folder')
  .option('-O, --output <dir>', 'Output folder', 'dist')
  .description("run compiler in development mode")
  .option('-D, --debug', 'output extra debugging')
  .option('-R, --reverse', 'Transpiles from emojs back into boring js')
  .option('-W, --watch', 'watch for changes', true)
  .action((options) => {
    if (!options.input) {
      console.error("Please provide an input folder")
      process.exit(1)
    }
    const debug = !!options.debug;
    const watch = !!options.watch;
    dev(options.reverse, options.input, options.output, debug, watch)
  })


program.parse(process.argv);
