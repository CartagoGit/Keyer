"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptAny = exports.encrypt = void 0;
var node_crypto_1 = require("node:crypto");
var encrypt = function (props) {
    var toEncrypt = props.toEncrypt, secretSalt = props.secretSalt, _a = props.showLog, showLog = _a === void 0 ? true : _a;
    var key = (0, node_crypto_1.scryptSync)(secretSalt, 'sal', 32);
    var iv = (0, node_crypto_1.randomBytes)(16);
    var cipher = (0, node_crypto_1.createCipheriv)('aes-256-cbc', key, iv);
    var encrypted = Buffer.concat([cipher.update(toEncrypt), cipher.final()]);
    var result = "".concat(iv.toString('hex'), ":").concat(encrypted.toString('hex'));
    if (showLog)
        console.log('Text encrypted: ', result);
    return result;
};
exports.encrypt = encrypt;
var encryptAny = function (props) {
    var toEncrypt = props.toEncrypt, secretSalt = props.secretSalt, _a = props.showLog, showLog = _a === void 0 ? true : _a;
    var result = (0, exports.encrypt)({
        toEncrypt: JSON.stringify(toEncrypt),
        secretSalt: secretSalt,
        showLog: false,
    });
    if (showLog)
        console.log('Any variable encrypted: ', result);
    return result;
};
exports.encryptAny = encryptAny;
