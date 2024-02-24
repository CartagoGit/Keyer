"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptAny = exports.encrypt = void 0;
const node_crypto_1 = require("node:crypto");
const json_helper_1 = require("./helpers/json.helper");
const common_constant_1 = require("./constants/common.constant");
const encrypt = (props) => {
    const { toEncrypt, secretSalt, showLog = true } = props;
    const key = (0, node_crypto_1.scryptSync)(secretSalt, 'sal', 32);
    const iv = (0, node_crypto_1.randomBytes)(16);
    const cipher = (0, node_crypto_1.createCipheriv)('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(toEncrypt), cipher.final()]);
    const result = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    if (showLog)
        console.log('Text encrypted: ', result);
    return result;
};
exports.encrypt = encrypt;
const encryptAny = (props) => {
    const { toEncrypt, secretSalt, showLog = true } = props;
    if (!(0, common_constant_1.isValidType)(toEncrypt))
        throw new Error('Invalid type');
    const result = (0, exports.encrypt)({
        toEncrypt: JSON.stringify(toEncrypt, json_helper_1.replacer),
        secretSalt,
        showLog: false,
    });
    if (showLog)
        console.log('Any variable encrypted: ', result);
    return result;
};
exports.encryptAny = encryptAny;
