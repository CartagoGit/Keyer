import { scryptSync, createDecipheriv } from 'node:crypto';
import { isValidType } from './constants/common.constant';

export const decrypt = (props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toDecrypt, secretSalt, showLog = true } = props;
	const [iv, encrypted] = toDecrypt.split(':');
	const key = scryptSync(secretSalt, 'sal', 32);
	const decipher = createDecipheriv(
		'aes-256-cbc',
		key,
		Buffer.from(iv, 'hex')
	);
	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(encrypted, 'hex')),
		decipher.final(),
	]);
	const result = decrypted.toString();
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
		})
	);
	if (isValidType(result)) throw new Error('Invalid type');
	if (showLog) console.log('Any variable decrypted: ', result);
	return result;
};
