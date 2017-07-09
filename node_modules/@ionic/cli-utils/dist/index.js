"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./guards"));
__export(require("./lib/app"));
__export(require("./lib/command"));
__export(require("./lib/command/command"));
__export(require("./lib/command/namespace"));
__export(require("./lib/command/utils"));
__export(require("./lib/config"));
__export(require("./lib/deploy"));
__export(require("./lib/errors"));
__export(require("./lib/events"));
__export(require("./lib/help"));
__export(require("./lib/hooks"));
__export(require("./lib/http"));
__export(require("./lib/login"));
__export(require("./lib/modules"));
__export(require("./lib/package"));
__export(require("./lib/plugins"));
__export(require("./lib/project"));
__export(require("./lib/prompts"));
__export(require("./lib/security"));
__export(require("./lib/session"));
__export(require("./lib/shell"));
__export(require("./lib/telemetry"));
__export(require("./lib/utils/archive"));
__export(require("./lib/utils/array"));
__export(require("./lib/utils/environmentInfo"));
__export(require("./lib/utils/format"));
__export(require("./lib/utils/fs"));
__export(require("./lib/utils/logger"));
__export(require("./lib/utils/network"));
__export(require("./lib/utils/npm"));
__export(require("./lib/utils/promise"));
__export(require("./lib/utils/shell"));
__export(require("./lib/utils/string"));
__export(require("./lib/utils/task"));
__export(require("./lib/validators"));
exports.name = '@ionic/cli-utils';
exports.version = '1.4.0';
function registerHooks(hooks) {
    hooks.register(exports.name, 'command:info', () => __awaiter(this, void 0, void 0, function* () {
        return [
            { type: 'global-packages', name: exports.name, version: exports.version },
        ];
    }));
}
exports.registerHooks = registerHooks;
