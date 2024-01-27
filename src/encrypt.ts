import { createCipheriv, randomBytes, scryptSync } from 'crypto';

export const encrypt = (props: {
	textToEncrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { textToEncrypt, secretSalt, showLog = true } = props;
	const key = scryptSync(secretSalt, 'sal', 32);
	const iv = randomBytes(16);
	const cipher = createCipheriv('aes-256-cbc', key, iv);
	const encrypted = Buffer.concat([
		cipher.update(textToEncrypt),
		cipher.final(),
	]);
	const result = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
	if (showLog) console.log('Text encrypted: ', result);
	return result;
};

export const encryptAny = (props: {
	anyToEncrypt: any;
	secretSalt: string;
}): string => {
	const { anyToEncrypt, secretSalt } = props;
	const result = encrypt({
		textToEncrypt: JSON.stringify(anyToEncrypt),
		secretSalt,
		showLog: false,
	});
	console.log('Object encrypted: ', result);
	return result;
};
