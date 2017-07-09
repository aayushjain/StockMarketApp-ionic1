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
const chalk = require("chalk");
const path = require("path");
const cli_utils_1 = require("@ionic/cli-utils");
const index_1 = require("./serve/index");
exports.name = '@ionic/cli-plugin-ionic1';
exports.version = '2.0.0';
exports.preferGlobal = false;
function registerHooks(hooks) {
    hooks.register(exports.name, 'command:docs', () => __awaiter(this, void 0, void 0, function* () {
        return 'https://ionicframework.com/docs/v1/';
    }));
    hooks.register(exports.name, 'command:info', ({ env }) => __awaiter(this, void 0, void 0, function* () {
        if (!env.project.directory) {
            return [];
        }
        const getIonic1Version = () => __awaiter(this, void 0, void 0, function* () {
            const ionicVersionFilePath = path.resolve(env.project.directory, 'www', 'lib', 'ionic', 'version.json');
            try {
                const ionicVersionJson = yield cli_utils_1.fsReadJsonFile(ionicVersionFilePath);
                return ionicVersionJson['version'];
            }
            catch (e) {
                env.log.error(`Error with ${chalk.bold(ionicVersionFilePath)} file: ${e}`);
            }
        });
        const ionic1Version = yield getIonic1Version();
        return [
            { type: 'local-packages', name: 'Ionic Framework', version: ionic1Version ? `ionic1 ${ionic1Version}` : 'unknown' },
            { type: 'local-packages', name: exports.name, version: exports.version },
        ];
    }));
    hooks.register(exports.name, 'command:serve', (args) => __awaiter(this, void 0, void 0, function* () {
        return index_1.serve(args);
    }));
}
exports.registerHooks = registerHooks;
