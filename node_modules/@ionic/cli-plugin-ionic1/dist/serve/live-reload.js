"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const modules_1 = require("../lib/modules");
function createLiveReloadServer(options) {
    const tinylr = modules_1.load('tiny-lr');
    const liveReloadServer = tinylr();
    liveReloadServer.listen(options.livereloadPort, options.address);
    return (changedFiles) => {
        liveReloadServer.changed({
            body: {
                files: changedFiles.map(changedFile => ('/' + path.relative(options.wwwDir, changedFile)))
            }
        });
    };
}
exports.createLiveReloadServer = createLiveReloadServer;
function injectLiveReloadScript(content, host, port) {
    let contentStr = content.toString();
    const liveReloadScript = getLiveReloadScript(host, port);
    if (contentStr.indexOf('/livereload.js') > -1) {
        return content;
    }
    let match = contentStr.match(/<\/body>(?![\s\S]*<\/body>)/i);
    if (!match) {
        match = contentStr.match(/<\/html>(?![\s\S]*<\/html>)/i);
    }
    if (match) {
        contentStr = contentStr.replace(match[0], `${liveReloadScript}\n${match[0]}`);
    }
    else {
        contentStr += liveReloadScript;
    }
    return contentStr;
}
exports.injectLiveReloadScript = injectLiveReloadScript;
function getLiveReloadScript(host, port) {
    if (host === '0.0.0.0') {
        host = 'localhost';
    }
    const src = `//${host}:${port}/livereload.js?snipver=1`;
    return `  <!-- Ionic Dev Server: Injected LiveReload Script -->\n` +
        `  <script src="${src}" async="" defer=""></script>`;
}
