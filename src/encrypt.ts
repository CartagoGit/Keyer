import { createCipheriv, randomBytes, scryptSync } from 'node:crypto';
import { replacer } from './helpers/json.helper';

export const encrypt = (props: {
	toEncrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toEncrypt, secretSalt, showLog = true } = props;
	const key = scryptSync(secretSalt, 'sal', 32);
	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', key, iv);
	const encrypted = Buffer.concat([cipher.update(toEncrypt), cipher.final()]);
	const result = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
	if (showLog) console.log('Text encrypted: ', result);
	console.log('result', result);
	return result;
};

export const encryptAny = (props: {
	toEncrypt: any;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { toEncrypt, secretSalt, showLog = true } = props;
	const result = encrypt({
		toEncrypt: JSON.stringify(toEncrypt, replacer),
		secretSalt,
		showLog: false,
	});
	if (showLog) console.log('Any variable encrypted: ', result);
	return result;
};
