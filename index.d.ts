interface FileLoaderOption {
    baseDirs: string[];
    ignores?: string[];
    handler?: Function;
}
declare class FileLoader {
    private options;
    constructor(options: FileLoaderOption);
    parse(): Array<string>;
    load(): Array<any>;
    private loadFile;
}
export default FileLoader;
