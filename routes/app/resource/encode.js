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
                const encoded = encodePNG(buffer);
                fs_1.default.writeFileSync(filePath, encoded);
            }
            else if (file.endsWith(".json") && !file.startsWith('manifest') && !file.startsWith('.config')) {
                const obj = fs_1.default.readFileSync(filePath, 'utf-8');
                const encoded = encodeJSON(JSON.parse(obj));
                fs_1.default.writeFileSync(filePath, encoded);
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
function encodeJSON(jsonObject) {
    const jsonString = JSON.stringify(jsonObject, null, 4);
    return obfuscateString(jsonString).toString();
}
function unicodeEscape(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        result += "\\u" + ("0000" + charCode.toString(16)).slice(-4);
    }
    return result;
}
function obfuscateString(str) {
    return str.replace(/"[^"]*"|'[^']*'/g, (match) => {
        const cleanString = match.replace(/["']/g, '');
        return '"' + unicodeEscape(cleanString) + '"';
    });
}
function encodePNG(buffer) {
    const png = pngjs_1.PNG.sync.read(buffer);
    const header = Buffer.alloc(18 + png.width * png.height * 4);
    header.writeInt8(0, 0);
    header.writeInt8(0, 1);
    header.writeInt8(2, 2);
    header.writeInt16LE(0, 3);
    header.writeInt16LE(0, 5);
    header.writeInt8(0, 7);
    header.writeInt16LE(0, 8);
    header.writeInt16LE(0, 10);
    header.writeInt16LE(png.width, 12);
    header.writeInt16LE(png.height, 14);
    header.writeInt8(32, 16);
    header.writeUInt8(0x20, 17);
    let offset = 18;
    for (let i = 0; i < png.height; i++) {
        for (let j = png.width - 1; j >= 0; j--) {
            const idx = (i * png.width + (png.width - 1 - j)) * 4;
            if (offset + 4 <= header.length) {
                header.writeUInt8(png.data[idx + 2], offset);
                offset++;
                header.writeUInt8(png.data[idx + 1], offset);
                offset++;
                header.writeUInt8(png.data[idx], offset);
                offset++;
                header.writeUInt8(png.data[idx + 3], offset);
                offset++;
            }
            else
                break;
        }
    }
    return Buffer.concat([header, Buffer.from(png.data)]);
}
__1.default.post("/resource/encode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = req.body.base;
        const folder = req.body.folder;
        if (!base || !folder)
            res.status(400).send("Missing base or folder");
        const config = fs_1.default.readFileSync(`${base}/development_resource_packs/${folder}/.config.json`, 'utf-8');
        if (config) {
            const json = JSON.parse(config);
            if (json.isEncoded)
                res.status(500).send("Already Encoded");
            else {
                yield selectFile(`${base}/development_resource_packs/${folder}`);
                json.isEncoded = true;
                fs_1.default.writeFileSync(`${base}/development_resource_packs/${folder}/.config.json`, JSON.stringify(json, null, 4));
                res.status(200).send("OK");
            }
        }
        else {
            res.status(400).send("Missing .config.json");
        }
    }
    catch (err) {
        res.status(500).send("file .config.json not found");
    }
}));
