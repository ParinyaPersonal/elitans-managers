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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
function getLastVersion(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = (yield axios_1.default.get(`https://registry.npmjs.org/${packages}`)).data;
        const data = Array(...new Set(Object.keys(response.versions)
            .filter((item) => item.endsWith("stable"))
            .map((item) => ({
            default: item.split(".").slice(0, 3).join("."),
            version: item
        }))
            .reverse()));
        return data[0];
    });
}
__1.default.post("/behavior/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = req.body.base;
        const root = `${base}/development_behavior_packs`;
        fs_1.default.readdirSync(root).forEach((folder) => __awaiter(void 0, void 0, void 0, function* () {
            const fileStat = fs_1.default.lstatSync(`${root}/${folder}`);
            if (fileStat.isDirectory() && !folder.endsWith(" - ts")) {
                const manifest = fs_1.default.readFileSync(`${root}/${folder}/manifest.json`, 'utf-8');
                const data = JSON.parse(manifest);
                data.dependencies[0].version = (yield getLastVersion(data.dependencies[0].module_name)).default;
                data.dependencies[1].version = (yield getLastVersion(data.dependencies[1].module_name)).default;
                fs_1.default.writeFileSync(`${root}/${folder}/manifest.json`, JSON.stringify(data, null, 4));
            }
        }));
        (0, child_process_1.exec)([
            `cd ${base}`,
            `npm install @minecraft/server@${(yield getLastVersion("@minecraft/server")).version}`,
            `npm install @minecraft/server-ui@${(yield getLastVersion("@minecraft/server-ui")).version}`,
        ].join(" && "), (err, stdout, stderr) => {
            if (err) {
                throw new Error(err.message);
            }
            if (stderr) {
                throw new Error(stderr);
            }
        });
        res.status(200).send("done");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
