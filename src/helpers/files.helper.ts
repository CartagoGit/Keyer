import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const createFolderAndFile = (file: string) => {
	if (!existsSync(file)) {
		// Verify if folder exist
		const dir = dirname(file);
		if (!existsSync(dir)) {
			// Crea el directorio
			mkdirSync(dir, { recursive: true });
		}
	}
};
