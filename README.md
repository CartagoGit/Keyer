# Keyer

This app is just a library to encrypt and decrypt texts and any other variables with a salt.

## To install

`npm i keyer`

## CLI Basic

* `keyer` Cli to encrypt\descrypt automatic

* `keyer --version` or `-v` Library version

* `keyer --help` or `-h` Library CLI help

* `keyer --encrypt='folder/file'` Encrypter

* `keyer --decrypt='folder/file'` Decrypter

## To use command keyer

Just use the command `keyer` to autoscript.

> As default: It will get the `.env` file from root and create a new folder `keyer` when encrypt with a file `encrypted-hash.txt`

It accepts 

If you want change env or hash file just pass `--encryptFile` or `-ef` for file to encrypt; `--decryptFile` or `-df` for hash as arguments.

Example:
`keyer --encryptFile='folder/.env' --decryptFile='folder/hash.txt'`

## To use methods

For Example:

```Typescript
import {encrypt, decrypt, encryptAny, decriptAny}

const salt = "This is just a secret salt that you must hide for others";
const apiKey = 'api_false_example_to_show'

// To get the encrypted Hash
const apiKeyHash = encrypt({
    toEncrypt: apiKey,
    secretSalt: salt
})

// to get decrypt the Hash
const apiKeyDecrypted = decrypt({
    toDecrypt: apiKeyHash,
    secretSalt: salt
})

// NOTE - With an object or other var kind
const objectToEncrypt = {
    name: 'Joe',
    prename: 'Doe',
    age: 30
}

// To get the encrypted Hash
const objectHash = encryptAny({
    toEncrypt: objectToEncrypt,
    secretSalt: salt
})

// to get decrypt Hash
const objectDecrypted({
    toDecrypt: objectHash,
    secretSalt: salt
})

console.log({apiKeyHash, apiKeyDecrypted, objectHash, objectDecrypted})
```

## Optional

Every function has a showLog prop in true, just put it to false if doesnt want the encrypt log

```Typescript
encrypt({
    toEncrypt: apiKey,
    secretSalt: salt,
    showLog: false
})
```

