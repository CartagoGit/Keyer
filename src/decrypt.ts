import { scryptSync, createDecipheriv, CipherGCMTypes } from 'node:crypto';
import { reviver } from './helpers/json.helper';
import { isValidType } from './constants/common.constant';
import { gunzipSync } from 'node:zlib';

export const decrypt = (props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toDecrypt, secretSalt, showLog = true } = props;
	const [salt, ivBase64, authTagBase64, encryptedBase64] = toDecrypt.split(':');
	if(!salt || !ivBase64 || !authTagBase64 || !encryptedBase64) throw new Error('Invalid format');
	const iv = Buffer.from(ivBase64, 'base64');
	const authTag = Buffer.from(authTagBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');
	const key = scryptSync(secretSalt, salt, 32);
	const algorithm: CipherGCMTypes = 'aes-256-gcm';
	const decipher = createDecipheriv(
		algorithm,
		key,
		iv
	);
	decipher.setAuthTag(authTag);
	const decrypted = Buffer.concat([
		decipher.update(encrypted),
		decipher.final(),
	]);
	const result = gunzipSync(decrypted).toString();
	if (showLog) console.log('Text decrypted: ', result);
	return result;
};

export const decryptAny = <T = any>(props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): T => {
	const { toDecrypt, secretSalt, showLog = true } = props;
	const result = JSON.parse(
		decrypt({
			toDecrypt,
			secretSalt,
			showLog: false,
		}),
		reviver
	);
	if (!isValidType(result)) throw new Error('Invalid type');
	if (showLog) console.log('Any variable decrypted: ', result);
	return result;
};
