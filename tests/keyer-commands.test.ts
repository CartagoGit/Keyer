import { resolve } from 'node:path';

import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { outputFolder } from './constants/paths.contant';
import { decryptCommand, encryptCommand } from '../src/commands';

describe('commands', () => {
	it('encryptCommand -> should encrypt a file', () => {
		const testFile = resolve(outputFolder, 'test-input.txt');
		const outputFile = resolve(outputFolder, 'test-output.txt');
		const salt = 'salt';

		// Preparar el archivo de entrada
		writeFileSync(testFile, 'Texto a cifrar', 'utf-8');

		// Llamar a la función de cifrado
		encryptCommand({ file: testFile, output: outputFile, salt });

		// Verificar que el archivo cifrado existe y tiene contenido
		expect(readFileSync(outputFile, 'utf-8')).not.toBe('Texto a cifrar');

		// Limpiar el archivo de salida
		[testFile, outputFile].forEach((file) => unlinkSync(file));
	});
    it('decryptCommand -> should decrypt a file', () => {
        const encryptedFile = resolve(outputFolder, 'test-encrypted.txt');
        const decryptedFile = resolve(outputFolder, 'test-decrypted.txt');
        const salt = 'salt';
        const originalText = 'Texto original';
    
        // Preparar el archivo cifrado
        writeFileSync(encryptedFile, 'Texto cifrado', 'utf-8');
    
        // Llamar a la función de descifrado
        decryptCommand({ file: encryptedFile, output: decryptedFile, salt });
    
        // Verificar que el archivo descifrado existe y tiene el texto original
        expect(readFileSync(decryptedFile, 'utf-8')).toBe(originalText);
    
        // Limpiar los archivos
        unlinkSync(encryptedFile);
        unlinkSync(decryptedFile);
    });
});
