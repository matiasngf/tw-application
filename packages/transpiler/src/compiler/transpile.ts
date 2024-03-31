import ts, { CompilerOptions, createCompilerHost } from "typescript";
import { parse } from "@tw-application/parser";
// import fs from "fs";

const tsCompile = (options: CompilerOptions, pathList: string[]) => {

  const host = createCompilerHost(options);
  // Override the writeFile function of the host
  const originalWriteFile = host.writeFile;
  host.writeFile = (fileName, text, writeByteOrderMark, onError, sourceFiles, data) => {

    if (fileName.endsWith('.js')) {
      fileName = fileName.replace('.js', '.emojs');
      const generatedCode = parse(text, true);
      text = generatedCode;

    }

    if (fileName.endsWith('.d.ts')) {
      fileName = fileName.replace('.d.ts', '.emojs.d.ts');
    }
    originalWriteFile(fileName, text, writeByteOrderMark, onError, sourceFiles, data);
  };

  const program = ts.createProgram(pathList, options, host);
  program.emit();
}

export const transpile = (outputDir: string, pathList: string[]) => {
  const options: CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: false,
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.Preserve,
    removeComments: false,
    skipLibCheck: true,
    strict: true,
    noEmitOnError: false,
    noImplicitAny: false,
    outDir: outputDir,
  }
  tsCompile(options, pathList);

}
