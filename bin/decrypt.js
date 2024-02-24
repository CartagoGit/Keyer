"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptAny = exports.decrypt = void 0;
const node_crypto_1 = require("node:crypto");
const json_helper_1 = require("./helpers/json.helper");
const common_constant_1 = require("./constants/common.constant");
const decrypt = (props) => {
    const { toDecrypt, secretSalt, showLog = true } = props;
    const [iv, encrypted] = toDecrypt.split(':');
    const key = (0, node_crypto_1.scryptSync)(secretSalt, 'sal', 32);
    const decipher = (0, node_crypto_1.createDecipheriv)('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'hex')),
        decipher.final(),
    ]);
    const result = decrypted.toString();
    if (showLog)
        console.log('Text decrypted: ', result);
    return result;
};
exports.decrypt = decrypt;
const decryptAny = (props) => {
    const { toDecrypt, secretSalt, showLog = true } = props;
    const result = JSON.parse((0, exports.decrypt)({
        toDecrypt,
        secretSalt,
        showLog: false,
    }), json_helper_1.reviver);
    if (!(0, common_constant_1.isValidType)(result))
        throw new Error('Invalid type');
    if (showLog)
        console.log('Any variable decrypted: ', result);
    return result;
};
exports.decryptAny = decryptAny;
