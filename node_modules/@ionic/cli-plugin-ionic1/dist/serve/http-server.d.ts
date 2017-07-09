/// <reference types="express" />
import * as expressType from 'express';
import { ServerOptions } from './config';
import { IProject } from '@ionic/cli-utils';
export declare function createHttpServer(project: IProject, options: ServerOptions): Promise<expressType.Application>;
