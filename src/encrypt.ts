import {
	CipherGCMTypes,
	createCipheriv,
	randomBytes,
	scryptSync,
} from 'node:crypto';
import { replacer } from './helpers/json.helper';
import { isValidType } from './constants/common.constant';
import { gzipSync } from 'node:zlib';

export const encrypt = (props: {
	toEncrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toEncrypt, secretSalt, showLog = true } = props;
	const compressed = gzipSync(toEncrypt);
	const salt = randomBytes(16).toString('base64');
	const key = scryptSync(secretSalt, salt, 32);
	const iv = randomBytes(16);
	const algorithm: CipherGCMTypes = 'aes-256-gcm';
	const cipher = createCipheriv(algorithm, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(compressed),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();
	const result = `${salt}:${iv.toString('base64')}:${authTag.toString(
		'base64'
	)}:${encrypted.toString('base64')}`;
	if (showLog) console.log('Text encrypted: ', result);
	return result;
};

export const encryptAny = (props: {
	toEncrypt: any;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toEncrypt, secretSalt, showLog = true } = props;
	if (!isValidType(toEncrypt)) throw new Error('Invalid type');
	const result = encrypt({
		toEncrypt: JSON.stringify(toEncrypt, replacer),
		secretSalt,
		showLog: false,
	});
	if (showLog) console.log('Any variable encrypted: ', result);
	return result;
};
