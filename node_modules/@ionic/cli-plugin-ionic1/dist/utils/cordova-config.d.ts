export interface CordovaProject {
    name?: string;
    id?: string;
    version?: string;
}
export declare function buildCordovaConfig(errCb: Function, cb: Function): void;
export declare function parseConfig(parsedConfig: any): CordovaProject;
