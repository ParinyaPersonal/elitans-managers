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
exports.load = exports.encryptData = exports.decryptData = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const key = "APISENDER";
function decryptData(data) {
    return crypto_js_1.default.AES.decrypt(data, key).toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptData = decryptData;
function encryptData(data) {
    return crypto_js_1.default.AES.encrypt(data, key).toString();
}
exports.encryptData = encryptData;
function load(dir, proviso, fileFunc, dirFunc) {
    return __awaiter(this, void 0, void 0, function* () {
        const subDir = [];
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const filePath = `${dir}/${file}`;
            const fileStat = fs_1.default.lstatSync(filePath);
            if (fileStat.isDirectory()) {
                subDir.push(file);
                if (dirFunc)
                    yield dirFunc(filePath);
            }
            else if (proviso(file))
                yield fileFunc(filePath);
        }
        for (const folder of subDir) {
            const subDir = `${dir}/${folder}`;
            if (!fs_1.default.existsSync(subDir))
                continue;
            yield load(subDir, proviso, fileFunc, dirFunc);
        }
    });
}
exports.load = load;
