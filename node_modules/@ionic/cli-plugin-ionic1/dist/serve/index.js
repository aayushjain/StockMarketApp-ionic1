"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const chalk = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const helpers_1 = require("../utils/helpers");
const http_server_1 = require("./http-server");
const live_reload_1 = require("./live-reload");
const config_1 = require("./config");
const modules_1 = require("../lib/modules");
function serve(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let chosenIP = 'localhost';
        if (args.options.externalIpRequired) {
            const availableIPs = cli_utils_1.getAvailableIPAddress();
            if (availableIPs.length === 0) {
                throw new Error(`It appears that you do not have any external network interfaces. ` +
                    `In order to use livereload with emulate you will need one.`);
            }
            chosenIP = availableIPs[0].address;
            if (availableIPs.length > 1) {
                args.env.log.warn(`${chalk.bold('Multiple network interfaces detected!')}\n` +
                    'You will be prompted to select an external-facing IP for the livereload server that your device or emulator has access to.\n' +
                    `You may also use the ${chalk.green('--address')} option to skip this prompt.\n`);
                const promptedIp = yield args.env.prompt({
                    type: 'list',
                    name: 'promptedIp',
                    message: 'Please select which IP to use:',
                    choices: availableIPs.map(ip => ip.address)
                });
                chosenIP = promptedIp;
            }
        }
        const serverArgs = cli_utils_1.minimistOptionsToArray(args.options);
        args.env.log.info(`Starting server: ${chalk.bold(serverArgs.join(' '))} - Ctrl+C to cancel`);
        const projectConfig = yield args.env.project.load();
        const serverOptions = {
            projectRoot: args.env.project.directory,
            wwwDir: path.join(args.env.project.directory, projectConfig.documentRoot || 'www'),
            address: args.options['address'] || config_1.DEFAULT_ADDRESS,
            port: helpers_1.stringToInt(args.options['port'], config_1.DEFAULT_SERVER_PORT),
            httpPort: helpers_1.stringToInt(args.options['port'], config_1.DEFAULT_SERVER_PORT),
            livereloadPort: helpers_1.stringToInt(args.options['livereload-port'], config_1.DEFAULT_LIVERELOAD_PORT),
            browser: args.options['browser'],
            browseroption: args.options['browseroption'],
            platform: args.options['platform'],
            consolelogs: args.options['consolelogs'] || false,
            serverlogs: args.options['serverlogs'] || false,
            nobrowser: args.options['nobrowser'] || false,
            nolivereload: args.options['nolivereload'] || false,
            noproxy: args.options['noproxy'] || false,
            lab: args.options['lab'] || false,
            iscordovaserve: args.options['iscordovaserve'] || false,
        };
        const portResults = yield Promise.all([
            cli_utils_1.findClosestOpenPort(serverOptions.address, serverOptions.port),
            cli_utils_1.findClosestOpenPort(serverOptions.address, serverOptions.livereloadPort),
        ]);
        serverOptions.port = serverOptions.httpPort = portResults[0];
        serverOptions.livereloadPort = portResults[1];
        const settings = yield setupServer(args.env, serverOptions);
        const localAddress = 'http://localhost:' + serverOptions.port;
        const externalAddress = 'http://' + chosenIP + ':' + serverOptions.port;
        args.env.log.info(`Development server running\n` +
            `Local: ${chalk.bold(localAddress)}\n` +
            (localAddress !== externalAddress ? `External: ${chalk.bold(externalAddress)}\n` : ''));
        if (!serverOptions.nobrowser || serverOptions.lab) {
            const openOptions = [localAddress]
                .concat(serverOptions.lab ? [config_1.IONIC_LAB_URL] : [])
                .concat(serverOptions.browseroption ? [serverOptions.browseroption] : [])
                .concat(serverOptions.platform ? ['?ionicplatform=', serverOptions.platform] : []);
            const opn = modules_1.load('opn');
            opn(openOptions.join(''));
        }
        return Object.assign({ publicIp: chosenIP }, settings);
    });
}
exports.serve = serve;
function setupServer(env, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const liveReloadBrowser = live_reload_1.createLiveReloadServer(options);
        yield http_server_1.createHttpServer(env.project, options);
        const chokidar = modules_1.load('chokidar');
        const projectConfig = yield env.project.load();
        if (!projectConfig.watchPatterns) {
            projectConfig.watchPatterns = [];
        }
        const watchPatterns = [...new Set([...projectConfig.watchPatterns, ...config_1.WATCH_PATTERNS])];
        env.log.debug(`Watch patterns: ${watchPatterns.map(v => chalk.bold(v)).join(', ')}`);
        const watcher = chokidar.watch(watchPatterns, { cwd: env.project.directory });
        env.events.emit('watch:init');
        watcher.on('change', (filePath) => {
            env.log.info(`[${new Date().toTimeString().slice(0, 8)}] ${chalk.bold(filePath)} changed`);
            liveReloadBrowser([filePath]);
            env.events.emit('watch:change', filePath);
        });
        watcher.on('error', (err) => {
            env.log.error(err.toString());
        });
        return options;
    });
}
