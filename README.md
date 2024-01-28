# Keyer

This app is just a library to encrypt and decrypt texts and any other variables with a salt.

## To install

`npm i @cartago-git/keyer`

## CLI Basic

* `keyer --version` or `-v`

* `keyer --help` or `-h`

## To use command

Just use the command `keyer` to autoscript.

> As default: It will get the `.env` file from root and create a new folder `keyer` when encrypt with a file `encrypted-hash.txt`

If you want change env or hash file just pass `--env-file` or `-ef` for file to encrypt; `--hash-file` or `-hf` for hash as arguments.

Example:
`keyer --env-file='folder/.env' --hash-file='folder/hash.txt'`

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
