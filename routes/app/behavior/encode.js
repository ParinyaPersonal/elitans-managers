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
const javascript_obfuscator_1 = require("javascript-obfuscator");
const __1 = __importDefault(require("../.."));
const fs_1 = __importDefault(require("fs"));
const functions_1 = require("../../functions");
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
function encodeJS(code) {
    return (0, javascript_obfuscator_1.obfuscate)(code, {
        compact: false,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    }).getObfuscatedCode();
}
function rootObf(dir, folder) {
    return dir.replace(`development_behavior_packs/${folder}/`, `development_behavior_packs/${folder} - obf/`);
}
__1.default.post("/behavior/encode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = req.body.base;
        const folder = req.body.folder;
        if (!base || !folder)
            res.status(400).send("Missing base or folder");
        const root = `${base}/development_behavior_packs/${folder}`;
        fs_1.default.mkdirSync(`${root} - obf`, { recursive: true });
        yield (0, functions_1.load)(root, () => true, (path) => __awaiter(void 0, void 0, void 0, function* () {
            const result = fs_1.default.readFileSync(path);
            fs_1.default.writeFileSync(rootObf(path, folder), result);
        }), (dire) => __awaiter(void 0, void 0, void 0, function* () {
            fs_1.default.mkdirSync(dire.replace(`/${folder}/`, `/${folder} - obf/`), { recursive: true });
        }));
        yield (0, functions_1.load)(`${root} - obf`, (file) => file.endsWith('.js'), (path) => __awaiter(void 0, void 0, void 0, function* () {
            const result = fs_1.default.readFileSync(path, 'utf-8');
            fs_1.default.writeFileSync(rootObf(path, folder), encodeJS(result));
        }), (dire) => __awaiter(void 0, void 0, void 0, function* () {
            fs_1.default.mkdirSync(dire.replace(`/${folder}/`, `/${folder} - obf/`), { recursive: true });
        }));
        yield (0, functions_1.load)(`${root} - obf`, (file) => (file.endsWith(".json") && !file.startsWith('manifest')), (path) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("path: " + path);
            const result = fs_1.default.readFileSync(path, 'utf-8');
            fs_1.default.writeFileSync(rootObf(path, folder), encodeJSON(JSON.parse(result)));
        }), (dire) => __awaiter(void 0, void 0, void 0, function* () {
            fs_1.default.mkdirSync(dire.replace(`/${folder}/`, `/${folder} - obf/`), { recursive: true });
        }));
        res.status(200).send("OK");
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}));
