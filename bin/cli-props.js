"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.keyerOptions = exports.decryptOptions = exports.encryptOptions = exports.defaultOptions = exports.defaultFiles = exports.helpMessage = void 0;
const _1 = require(".");
// Props
exports.helpMessage = '(add --help for additional information)';
exports.defaultFiles = {
    encryptRoute: '.env',
    encryptedRoute: 'keyer/encrypted.txt',
    decryptedRoute: 'keyer/decrypted.txt',
};
exports.defaultOptions = {
    file: {
        command: '--file',
        argument: '<file>',
        short: '-f',
        description: 'route file',
        default: null,
    },
    output: {
        command: '--output',
        argument: '<output>',
        short: '-o',
        description: 'route file output',
        default: null,
    },
    salt: {
        command: '--salt',
        argument: '<salt>',
        short: '-s',
        description: 'secret salt',
        default: null,
        isRequired: true,
    },
};
exports.encryptOptions = {
    file: {
        ...exports.defaultOptions.file,
        description: 'route where is the file for encrypting',
        default: exports.defaultFiles.encryptRoute,
    },
    output: {
        ...exports.defaultOptions.output,
        description: 'route where file encrypted will create',
        default: exports.defaultFiles.encryptedRoute,
    },
    salt: exports.defaultOptions.salt,
};
exports.decryptOptions = {
    file: {
        ...exports.defaultOptions.file,
        default: exports.defaultFiles.encryptedRoute,
    },
    output: {
        ...exports.defaultOptions.output,
        description: 'route where file will decrypted',
        default: exports.defaultFiles.decryptedRoute,
    },
    salt: exports.defaultOptions.salt,
    createOutput: {
        command: '--create-output',
        argument: null,
        short: '-co',
        description: 'create file output',
        default: false,
    },
};
exports.keyerOptions = {
    'encrypt-route': {
        command: 'encrypt-route',
        argument: '<encrypt-route>',
        short: '-er',
        description: 'route from file to encrypt',
        default: exports.defaultFiles.encryptRoute,
    },
    'encrypted-route': {
        command: 'encrypted-route',
        argument: '<encrypted-route>',
        short: '-edr',
        description: 'route from file when it will be encrypted',
        default: exports.defaultFiles.encryptedRoute,
    },
    'decrypted-route': {
        command: 'decrypted-route',
        argument: '<decrypted-route>',
        short: '-dr',
        description: 'route from file when it will be decrypted',
        default: exports.defaultFiles.decryptedRoute,
    },
};
exports.commands = {
    encrypt: {
        command: 'encrypt',
        description: 'encrypt command cli',
        options: exports.encryptOptions,
        action: (arg) => {
            (0, _1.encryptCommand)(arg);
        },
    },
    decrypt: {
        command: 'decrypt',
        description: 'decrypt command cli',
        options: exports.decryptOptions,
        action: (arg) => {
            (0, _1.decryptCommand)(arg);
        },
    },
};
