import fs from 'fs';
import path from 'path';
import globby from 'globby';

interface FileLoaderOption {
  baseDirs: string[],
  ignores?: string[],
  handler?: Function
}

class FileLoader {
  private options: any;
  constructor(options: FileLoaderOption) {
    this.options = Object.assign({
      baseDirs: [],
      ignores: [],
      handler: () => {}
    }, options);
  }

  public parse(): Array<string> {
    const {baseDirs, ignores} = this.options;
    const filePaths: Array<string> = [];
    baseDirs.forEach((dir: string) => {
      let paths = globby.sync(dir);
      if(ignores) { paths = paths.filter((path:string) => !ignores.includes(path))}
      paths.forEach((path:string) => filePaths.push(path));
    });
    return filePaths;
  }

  public load(): Array<any> {
    const filePaths = this.parse();
    return filePaths.map((filePath: string) => {
      const obj = this.loadFile(filePath);
      if(this.options.handler) {
        this.options.handler(obj)
      }
      return obj;
    });
  }

  private loadFile(filePath: string): any {
    try {
      const extname = path.extname(filePath);
      // @ts-ignore
      if(!(['.js', '.json', '.ts', '.node'].includes(extname))) { // includes是es7的语法
        return fs.readdirSync(filePath);
      }
      const obj = require(filePath);
      if(!obj) {
        throw new Error();
      }
      if(obj.__esModule) {
        return 'default' in obj ? obj.default : obj;
      }
      return obj;
    } catch (e) {
      throw e;
    }
  }
}

export default FileLoader;