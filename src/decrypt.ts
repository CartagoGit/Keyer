import { scryptSync, createDecipheriv } from 'node:crypto';

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

export const decryptAny = (props: {
	toDecrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): any => {
	const { toDecrypt, secretSalt, showLog = true } = props;
	const result = JSON.parse(
		decrypt({
			toDecrypt,
			secretSalt,
			showLog: false,
		})
	);
	if (showLog) console.log('Any variable decrypted: ', result);
	return result;
};
