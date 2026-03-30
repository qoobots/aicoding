declare module 'adm-zip' {
  class AdmZip {
    constructor(input?: Buffer | string | number);
    addLocalFile(localPath: string, zipPath?: string, zipName?: string): void;
    toBuffer(): Buffer;
    addLocalFolder(localPath: string, zipPath?: string): void;
    addFile(entry: string, content: Buffer | string): void;
    extractAllTo(targetPath: string, overwrite?: boolean): void;
    getEntries(): any[];
    readText(entry: string): string;
  }

  export = AdmZip;
}
