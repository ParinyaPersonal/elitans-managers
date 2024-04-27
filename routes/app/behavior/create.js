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
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
__1.default.post("/behavior/create", upload.single('icon'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manifest = JSON.parse(req.body.manifest);
    const base = req.body.base;
    const folder = req.body.folder;
    const language = req.body.language;
    const api = req.body.api;
    console.log(language);
    if (!manifest || !base)
        res.status(400).send("Missing manifest or base");
    if (!req.file)
        res.status(400).send("Missing icon");
    const icon = req.file.buffer;
    fs_1.default.mkdirSync(`${base}/development_behavior_packs/${folder}`, { recursive: true });
    if (manifest.dependencies) {
        fs_1.default.mkdirSync(`${base}/development_behavior_packs/${folder} - ts`, { recursive: true });
        fs_1.default.mkdirSync(`${base}/development_behavior_packs/${folder} - ts/src`, { recursive: true });
        if (language === "javascript")
            return;
        fs_1.default.writeFileSync(`${base}/development_behavior_packs/${folder} - ts/src/main.ts`, "");
        fs_1.default.writeFileSync(`${base}/development_behavior_packs/${folder} - ts/tsconfig.json`, JSON.stringify({
            "compilerOptions": {
                "target": "ESNext",
                "lib": [
                    "dom",
                    "es6",
                    "es2015",
                    "es2016",
                    "es2017",
                    "es2017.string",
                    "es2021"
                ],
                "moduleResolution": "node",
                "module": "ESNext",
                "outDir": `../${folder}/scripts`,
                "rootDir": "./src",
                "sourceMap": false
            },
            "exclude": [
                "node_modules"
            ]
        }, null, 4));
    }
    fs_1.default.writeFileSync(`${base}/development_behavior_packs/${folder}/pack_icon.png`, icon);
    fs_1.default.writeFileSync(`${base}/development_behavior_packs/${folder}/manifest.json`, JSON.stringify(manifest, null, 4));
    res.status(200).send("OK");
}));
