import { IConfig, ILogger, ConfigFile, PromptModule } from '../definitions';
export declare function createPromptModule(log: ILogger, config: IConfig<ConfigFile>): Promise<PromptModule>;
