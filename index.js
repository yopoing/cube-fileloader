"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const globby_1 = __importDefault(require("globby"));
class FileLoader {
    constructor(options) {
        this.options = Object.assign({
            baseDirs: [],
            ignores: [],
            handler: () => { }
        }, options);
    }
    parse() {
        const { baseDirs, ignores } = this.options;
        const filePaths = [];
        baseDirs.forEach((dir) => {
            let paths = globby_1.default.sync(dir);
            if (ignores) {
                paths = paths.filter((path) => !ignores.includes(path));
            }
            paths.forEach((path) => filePaths.push(path));
        });
        return filePaths;
    }
    load() {
        const filePaths = this.parse();
        return filePaths.map((filePath) => {
            const obj = this.loadFile(filePath);
            if (this.options.handler) {
                this.options.handler(obj);
            }
            return obj;
        });
    }
    loadFile(filePath) {
        try {
            const extname = path_1.default.extname(filePath);
            // @ts-ignore
            if (!(['.js', '.json', '.ts', '.node'].includes(extname))) { // includes是es7的语法
                return fs_1.default.readdirSync(filePath);
            }
            const obj = require(filePath);
            if (!obj) {
                throw new Error();
            }
            if (obj.__esModule) {
                return 'default' in obj ? obj.default : obj;
            }
            return obj;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = FileLoader;
