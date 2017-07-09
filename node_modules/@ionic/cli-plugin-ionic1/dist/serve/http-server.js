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
const live_reload_1 = require("./live-reload");
const fs = require("fs");
const url = require("url");
const config_1 = require("./config");
const lab_1 = require("./lab");
const modules_1 = require("../lib/modules");
function createHttpServer(project, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const express = modules_1.load('express');
        const app = express();
        app.set('serveOptions', options);
        app.listen(options.port, options.address);
        app.get('/', serveIndex);
        app.use('/', express.static(options.wwwDir));
        app.use(config_1.IONIC_LAB_URL + '/static', express.static(path.join(__dirname, '..', '..', 'lab', 'static')));
        app.get(config_1.IONIC_LAB_URL, lab_1.LabAppView);
        app.get(config_1.IONIC_LAB_URL + '/api/v1/cordova', lab_1.ApiCordovaProject);
        app.get('/cordova.js', servePlatformResource, serveMockCordovaJS);
        app.get('/cordova_plugins.js', servePlatformResource);
        app.get('/plugins/*', servePlatformResource);
        if (!options.noproxy) {
            yield setupProxies(project, app);
        }
        return app;
    });
}
exports.createHttpServer = createHttpServer;
function setupProxies(project, app) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectConfig = yield project.load();
        for (const proxy of projectConfig.proxies || []) {
            let opts = url.parse(proxy.proxyUrl);
            if (proxy.proxyNoAgent) {
                opts.agent = false;
            }
            opts.rejectUnauthorized = !(proxy.rejectUnauthorized === false);
            const proxyMiddleware = modules_1.load('proxy-middleware');
            app.use(proxy.path, proxyMiddleware(opts));
            console.log('Proxy added:' + proxy.path + ' => ' + url.format(opts));
        }
    });
}
function serveIndex(req, res) {
    const options = req.app.get('serveOptions');
    const indexFileName = path.join(options.wwwDir, 'index.html');
    fs.readFile(indexFileName, (err, indexHtml) => {
        if (!options.nolivereload) {
            indexHtml = live_reload_1.injectLiveReloadScript(indexHtml, options.address, options.livereloadPort);
        }
        res.set('Content-Type', 'text/html');
        res.send(indexHtml);
    });
}
function serveMockCordovaJS(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send('// mock cordova file during development');
}
function servePlatformResource(req, res, next) {
    const options = req.app.get('serveOptions');
    const userAgent = req.header('user-agent');
    let resourcePath = options.wwwDir;
    if (!options.iscordovaserve) {
        return next();
    }
    if (isUserAgentIOS(userAgent)) {
        resourcePath = path.join(options.projectRoot, config_1.IOS_PLATFORM_PATH);
    }
    else if (isUserAgentAndroid(userAgent)) {
        resourcePath = path.join(options.projectRoot, config_1.ANDROID_PLATFORM_PATH);
    }
    fs.stat(path.join(resourcePath, req.url), (err, stats) => {
        if (err) {
            return next();
        }
        res.sendFile(req.url, { root: resourcePath });
    });
}
function isUserAgentIOS(ua) {
    ua = ua.toLowerCase();
    return (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1);
}
function isUserAgentAndroid(ua) {
    ua = ua.toLowerCase();
    return ua.indexOf('android') > -1;
}
