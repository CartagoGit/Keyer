# Keyer

This app is just a library to encrypt and decrypt texts and any other variables with a salt.

> Secret encrypter for keys, api-keys, envs or others

## To install

To install in project

`npm install @cartago-git/keyer`

or for global install

`npm install --global @cartago-git/keyer`

## CLI

### CLI Basic

### Keyer Cli:

```Console
Usage: keyer [options] or [command]
    -v                                       output Keyer current version
    -er, encrypt-route <encrypt-route>       route from file to encrypt (default: ".env")
    -edr, encrypted-route <encrypted-route>  route from file when it will be encrypted (default: "keyer/encrypted.txt")
    -dr, decrypted-route <decrypted-route>   route from file when it will be decrypted (default: "keyer/decrypted.txt")
    -h, --help                               output Keyer help

    Commands:
    encrypt [options]                        encrypt command cli
    decrypt [options]                        decrypt command cli
```

### Keyer encrypt:

```Console
Usage: keyer encrypt [options]

encrypt command cli

Options:
    -f, --file <file>      route where is the file for encrypting (default: ".env")
    -o, --output <output>  route where file encrypted will create (default: "keyer/encrypted.txt")
    -s, --salt <salt>      secret salt (required option)
    -h, --help             output Keyer help
```

### Keyer decrypt:

```Console
Usage: keyer decrypt [options]

decrypt command cli

Options:
    -f, --file <file>      route file (default: "keyer/encrypted.txt")
    -o, --output <output>  route where file will decrypted (default: "keyer/decrypted.txt")
    -s, --salt <salt>      secret salt (required option)
    -co, --create-output   create file output (default: false)
    -h, --help             output Keyer help
```

## Library

> Básic Methods

```Typescript
import {encrypt, decrypt, encryptAny, decryptAny}
```

```Typescript
encrypt(props: {
	toEncrypt: string;
	secretSalt: string;
	showLog?: boolean;  // (default:true)
}) => string
```

```Typescript
encryptAny(props: {
	toEncrypt: any;
	secretSalt: string;
	showLog?: boolean;  // (default:true)
}) => string
```

```Typescript
decrypt(props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;  // (default:true)
}) => string
```

```Typescript
decryptAny<T = any>(props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;  // (default:true)
}) => T
```

> Commands Methods

```Typescript
import {keyerCommand, encryptCommand, decryptCommand}
```

```Typescript
keyerCommand({
	encryptRoute: string;
	encryptedRoute: string;
	decryptedRoute: string;
}) => void
```

```Typescript
encryptCommand({
	file: string;
	output: string;
	salt: string;
}) => void
```

```Typescript
decryptCommand({
	file: string;
	output: string;
	salt: string;
    	createOutput?: boolean // (default:false)
}) => void
```

---

### Usage basic methods

For Example:

```Typescript
import {encrypt, decrypt, encryptAny, decryptAny}

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

// NOTE - Example - With an object or other var kind
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
const objectDecrypted = decryptAny({
    toDecrypt: objectHash,
    secretSalt: salt
})

console.log({apiKeyHash, apiKeyDecrypted, objectHash, objectDecrypted})
```

### Optional

Every function has a showLog prop in true, just put it to false if doesnt want the encrypt log

```Typescript
encrypt({
    toEncrypt: apiKey,
    secretSalt: salt,
    showLog: false
})
```

## NOTES

### Allowed types or instances to encrypt and decrypt

> typeof

-   string
-   number
-   boolean
-   null
-   undefined
-   object - (except with props with disallowed types or instances)
-   array - (except if It has some disallowed type or instance)

> instanceof

-   Object
-   Date
-   RegExp
-   Map
-   Set
-   Error

### Disallowed special types or instances to encrypt and decrypt

-   Function
-   Symbol
-   Bigint
-   any other non-serializable object
