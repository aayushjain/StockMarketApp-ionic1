import { ServerOptions } from './config';
export declare function createLiveReloadServer(options: ServerOptions): (changedFile: string[]) => void;
export declare function injectLiveReloadScript(content: any, host: string, port: number): any;
