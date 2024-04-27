"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const functions_1 = require("../functions");
__1.default.post('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const api = req.body.api;
    const response = yield axios_1.default.get("https://elitans-api-key.vercel.app/key");
    const list = JSON.parse((0, functions_1.decryptData)(response.data));
    res.status(200).send(list.some((item) => item.key === api));
}));
__1.default.post('/folder', (req, res) => {
    const base = req.body.base;
    const dir = req.body.dir;
    const folders = fs_1.default.readdirSync(`${base}/${dir}`).filter((file) => {
        const fileStat = fs_1.default.lstatSync(`${base}/${dir}/${file}`);
        return fileStat.isDirectory();
    });
    res.status(200).send(folders);
});
__1.default.post('/icon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = req.body.base;
        const dir = req.body.dir;
        const folder = req.body.folder;
        const buffer = fs_1.default.readFileSync(`${base}/${dir}/${folder}/pack_icon.png`);
        res.status(200).send(buffer);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
__1.default.post('/compile', (req, res) => {
    const type = req.body.type;
    const base = req.body.base;
    const dir = req.body.dir;
    const folder = req.body.folder;
    const zip = new adm_zip_1.default();
    zip.addLocalFolder(`${base}/${dir}/${folder}`);
    zip.writeZip(`${base}/${dir}/${folder}.${type}`);
    res.status(200).send(`${base}/${dir}/${folder}.${type}`);
});
__1.default.post('/delete', (req, res) => {
    const base = req.body.base;
    const dir = req.body.dir;
    const folder = req.body.folder;
    fs_1.default.rmdirSync(`${base}/${dir}/${folder}`, { recursive: true });
    res.status(200).send("OK");
});
