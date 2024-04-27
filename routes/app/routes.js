"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
__1.default.get('/', (req, res) => {
    res.render('index', {
        path: "/home",
        title: "Home"
    });
});
__1.default.get('/config', (req, res) => {
    res.render('index', {
        path: "/config",
        title: "Config"
    });
});
__1.default.get('/resource/create', (req, res) => {
    res.render('index', {
        path: "/resource/create",
        title: "Create Resource"
    });
});
__1.default.get('/resource/manage', (req, res) => {
    res.render('index', {
        path: "/resource/manage",
        title: "Manage Resource"
    });
});
__1.default.get('/behavior/create', (req, res) => {
    res.render('index', {
        path: "/behavior/create",
        title: "Create Behavior"
    });
});
__1.default.get('/behavior/manage', (req, res) => {
    res.render('index', {
        path: "/behavior/manage",
        title: "Manage Default Behavior"
    });
});
__1.default.get('/behavior/manage/obfuscate', (req, res) => {
    res.render('index', {
        path: "/behavior/manage/obfuscate",
        title: "Manage Obfuscate Behavior"
    });
});
__1.default.get('/behavior/manage/typescript', (req, res) => {
    res.render('index', {
        path: "/behavior/manage/typescript",
        title: "Manage Typescript Behavior"
    });
});
