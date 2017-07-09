import { BowerJson, IonicEnvironment, IShellRunOptions, PackageJson } from '../../definitions';
export declare const ERROR_INVALID_PACKAGE_JSON = "INVALID_PACKAGE_JSON";
export declare const ERROR_INVALID_BOWER_JSON = "INVALID_BOWER_JSON";
export declare function readPackageJsonFile(path: string): Promise<PackageJson>;
export declare function readBowerJsonFile(path: string): Promise<BowerJson>;
export interface PkgManagerOptions extends IShellRunOptions {
    command?: 'install' | 'uninstall';
    pkg?: string;
    global?: boolean;
    link?: boolean;
    save?: boolean;
    saveDev?: boolean;
    saveExact?: boolean;
}
export declare function pkgManagerArgs(env: IonicEnvironment, options?: PkgManagerOptions): Promise<string[]>;
