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
const __1 = __importDefault(require("../.."));
const fs_1 = __importDefault(require("fs"));
const pngjs_1 = require("pngjs");
const tga_1 = __importDefault(require("tga"));
const functions_1 = require("../../functions");
function selectFile(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const subDirs = [];
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const filePath = `${dir}/${file}`;
            const fileStat = fs_1.default.lstatSync(filePath);
            if (fileStat.isDirectory())
                subDirs.push(file);
            else if (file.endsWith(".png") && !file.startsWith('pack_icon')) {
                const buffer = fs_1.default.readFileSync(filePath);
                const tga = new tga_1.default(buffer);
                const png = new pngjs_1.PNG({ width: tga.width, height: tga.height });
                png.data = tga.pixels;
                png.pack().pipe(fs_1.default.createWriteStream(filePath));
            }
            else if (file.endsWith(".json") && !file.startsWith('manifest') && !file.startsWith('.config')) {
                const obj = fs_1.default.readFileSync(filePath, 'utf-8');
                const decoded = decodeJSON(obj);
                fs_1.default.writeFileSync(filePath, JSON.stringify(decoded, null, 4));
            }
            else
                continue;
        }
        for (const folder of subDirs) {
            const subDir = `${dir}/${folder}`;
            if (!fs_1.default.existsSync(subDir))
                continue;
            yield selectFile(subDir);
        }
    });
}
function decodeJSON(str) {
    return JSON.parse(unicodeUnescape(str));
}
function unicodeUnescape(str) {
    return str.replace(/\\u([0-9A-Fa-f]{4})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    });
}
__1.default.post("/resource/decode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = req.body.base;
        const folder = req.body.folder;
        const api = req.body.api;
        if (!base || !folder || !api)
            res.status(400).send("Missing base or folder or api");
        const config = fs_1.default.readFileSync(`${base}/development_resource_packs/${folder}/.config.json`, 'utf-8');
        const manifest = fs_1.default.readFileSync(`${base}/development_resource_packs/${folder}/manifest.json`, 'utf-8');
        if (config) {
            const jsonConfig = JSON.parse(config);
            const jsonManifest = JSON.parse(manifest);
            if (jsonConfig.isEncoded) {
                const data = jsonConfig.permissions;
                if ((0, functions_1.decryptData)(data[0]) === api && (0, functions_1.decryptData)(data[1]) === jsonManifest.modules[0].uuid) {
                    yield selectFile(`${base}/development_resource_packs/${folder}`);
                    jsonConfig.isEncoded = false;
                    fs_1.default.writeFileSync(`${base}/development_resource_packs/${folder}/.config.json`, JSON.stringify(jsonConfig, null, 4));
                    res.status(200).send("OK");
                }
                else
                    res.status(500).send("Invalid Permissions");
            }
            else
                res.status(500).send("Not Encoded");
        }
        else
            res.status(400).send("Missing .config.json");
    }
    catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
}));
