import { promises as fs } from 'fs';
import * as path from 'path';

// Crea el directorio de manera "Windows-like": base, base (2), base (3)...
export async function createUniqueDirectory(basePath: string): Promise<string> {
  const parent = path.dirname(basePath);
  const baseName = path.basename(basePath);

  // 1) Garantiza que el padre exista (deep) — aquí sí usamos recursive:true
  await fs.mkdir(parent, { recursive: true });

  // 2) Crea el último nivel con intento atómico (sin recursive)
  let candidate = path.join(parent, baseName);
  let n = 1;

  for (;;) {
    try {
      await fs.mkdir(candidate, { recursive: false });
      return candidate; // creado con éxito
    } catch (err: any) {
      if (err?.code === 'EEXIST') {
        n += 1; // Windows-style
        const suffixed = n === 2 ? `${baseName} (2)` : `${baseName} (${n})`;
        candidate = path.join(parent, suffixed);
        continue;
      }
      // Si vuelve a salir ENOENT aquí, el problema es el "parent" que no se pudo crear
      // por permisos, ruta demasiado larga, o nombre inválido.
      throw err;
    }
  }
}

// Crea subcarpetas dentro del path final
export async function createFolders(root: string, relativeFolders: string[]) {
  await Promise.all(
    relativeFolders.map((f) =>
      fs.mkdir(path.join(root, f), { recursive: true }),
    ),
  );
}

// Sanitiza nombres de carpeta/archivo para ser seguros en Windows y otros FS
export const sanitizePathName = (name: string): string => {
  // Replace invalid characters (including dots) with underscores
  let sanitized = name.replace(/[<>:"/\\|?*.\x00-\x1F]/g, '_');

  // Replace consecutive underscores with a single underscore
  sanitized = sanitized.replace(/_+/g, '_');

  // Remove leading and trailing spaces
  sanitized = sanitized.trim();

  // Ensure the name isn't empty after sanitization
  if (sanitized.length === 0) {
    sanitized = '_';
  }

  // Truncate to 255 characters (max length for most file systems)
  sanitized = sanitized.slice(0, 255);

  // Avoid reserved names in Windows
  const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
  if (reservedNames.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  return sanitized;
};
