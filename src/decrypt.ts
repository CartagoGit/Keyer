import { scryptSync, createDecipheriv } from 'crypto';

export const decrypt = (props: {
	textToDecrypt: string;
	secretSalt: string;
	showLog?: boolean;
}): string => {
	const { textToDecrypt, secretSalt, showLog = true } = props;
	const [iv, encrypted] = textToDecrypt.split(':');
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
	anyToDecrypt: string;
	secretSalt: string;
}): any => {
	const { anyToDecrypt, secretSalt } = props;
	const result = JSON.parse(
		decrypt({
			textToDecrypt: anyToDecrypt,
			secretSalt,
			showLog: false,
		})
	);
	console.log('Object decrypted: ', result);
	return result;
};
