"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolderAndFile = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const createFolderAndFile = (file) => {
    if (!(0, node_fs_1.existsSync)(file)) {
        // Verify if folder exist
        const dir = (0, node_path_1.dirname)(file);
        if (!(0, node_fs_1.existsSync)(dir)) {
            // Crea el directorio
            (0, node_fs_1.mkdirSync)(dir, { recursive: true });
        }
    }
};
exports.createFolderAndFile = createFolderAndFile;
