import * as dargsType from 'dargs';
import { CommandData, CommandLineOptions, NormalizedMinimistOpts } from '../../definitions';
export declare function minimistOptionsToArray(options: CommandLineOptions, dargsOptions?: dargsType.Opts): string[];
export declare function metadataToMinimistOptions(metadata: CommandData): NormalizedMinimistOpts;
export declare function validateInputs(argv: string[], metadata: CommandData): void;
export declare function filterOptionsByIntent(metadata: CommandData, options: CommandLineOptions, intentName?: string): CommandLineOptions;
