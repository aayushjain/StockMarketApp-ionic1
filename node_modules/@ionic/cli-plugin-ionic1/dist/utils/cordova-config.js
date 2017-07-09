"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const modules_1 = require("../lib/modules");
let lastConfig;
function buildCordovaConfig(errCb, cb) {
    const xml2js = modules_1.load('xml2js');
    const parser = new xml2js.Parser();
    fs.readFile('config.xml', (err, data) => {
        if (err) {
            errCb(err);
            return;
        }
        parser.parseString(data, (err, result) => {
            if (err) {
                errCb(err);
                return;
            }
            cb(parseConfig(result));
        });
    });
}
exports.buildCordovaConfig = buildCordovaConfig;
function parseConfig(parsedConfig) {
    if (!parsedConfig.widget) {
        return {};
    }
    let widget = parsedConfig.widget;
    let widgetAttrs = widget.$;
    let config = {
        name: widget.name[0]
    };
    if (widgetAttrs) {
        config.id = widgetAttrs.id;
        config.version = widgetAttrs.version;
    }
    lastConfig = config;
    return config;
}
exports.parseConfig = parseConfig;
