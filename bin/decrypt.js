"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptAny = exports.decrypt = void 0;
var node_crypto_1 = require("node:crypto");
var decrypt = function (props) {
    var toDecrypt = props.toDecrypt, secretSalt = props.secretSalt, _a = props.showLog, showLog = _a === void 0 ? true : _a;
    var _b = toDecrypt.split(':'), iv = _b[0], encrypted = _b[1];
    var key = (0, node_crypto_1.scryptSync)(secretSalt, 'sal', 32);
    var decipher = (0, node_crypto_1.createDecipheriv)('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    var decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, 'hex')),
        decipher.final(),
    ]);
    var result = decrypted.toString();
    if (showLog)
        console.log('Text decrypted: ', result);
    return result;
};
exports.decrypt = decrypt;
var decryptAny = function (props) {
    var toDecrypt = props.toDecrypt, secretSalt = props.secretSalt, _a = props.showLog, showLog = _a === void 0 ? true : _a;
    var result = JSON.parse((0, exports.decrypt)({
        toDecrypt: toDecrypt,
        secretSalt: secretSalt,
        showLog: false,
    }));
    if (showLog)
        console.log('Any variable decrypted: ', result);
    return result;
};
exports.decryptAny = decryptAny;
