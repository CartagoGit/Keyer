## 1.2.0

-   Changed npx for bun, to get better performance in tests
-   Better security in the encryption process and the decryption process.
-   Added compression to the encryption process, to reduce the size of the encrypted data.

## 1.1.6

-   Add Tests
-   Checks for kind typeof and possible values
-   Renew documentation
-   Allow encrypt and decrypt Object, Date, RegExp, Map, Set, Error
-   Disallow encrypt and decrypt Function, Symbol, Bigint or any other non-serializable object
