"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cordova_config_1 = require("../utils/cordova-config");
function LabAppView(req, res) {
    return res.sendFile('index.html', {
        root: path.join(__dirname, '..', '..', 'lab')
    });
}
exports.LabAppView = LabAppView;
function ApiCordovaProject(req, res) {
    cordova_config_1.buildCordovaConfig((err) => {
        res.status(400).json({
            status: 'error',
            message: 'Unable to load config.xml'
        });
    }, (config) => {
        res.json(config);
    });
}
exports.ApiCordovaProject = ApiCordovaProject;
