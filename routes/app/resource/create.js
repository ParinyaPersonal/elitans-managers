"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../.."));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const functions_1 = require("../../functions");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
__1.default.post("/resource/create", upload.single('icon'), (req, res) => {
    const manifest = JSON.parse(req.body.manifest);
    const base = req.body.base;
    const folder = req.body.folder;
    const api = req.body.api;
    if (!manifest || !base)
        res.status(400).send("Missing manifest or base");
    if (!req.file)
        res.status(400).send("Missing icon");
    const icon = req.file.buffer;
    fs_1.default.mkdirSync(`${base}/development_resource_packs/${folder}`, { recursive: true });
    fs_1.default.mkdirSync(`${base}/development_resource_packs/${folder}/textures`, { recursive: true });
    fs_1.default.mkdirSync(`${base}/development_resource_packs/${folder}/font`, { recursive: true });
    fs_1.default.writeFileSync(`${base}/development_resource_packs/${folder}/pack_icon.png`, icon);
    fs_1.default.writeFileSync(`${base}/development_resource_packs/${folder}/manifest.json`, JSON.stringify(manifest, null, 4));
    fs_1.default.writeFileSync(`${base}/development_resource_packs/${folder}/.config.json`, JSON.stringify({
        isEncoded: false,
        permissions: [
            (0, functions_1.encryptData)(api),
            (0, functions_1.encryptData)(manifest.modules[0].uuid)
        ]
    }, null, 4));
    res.status(200).send("OK");
});
