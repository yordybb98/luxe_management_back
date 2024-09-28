import { Request } from 'express';
const fs = require('fs');

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function extractTokenFromCookies(request: Request): string | undefined {
  return request.cookies?.authToken;
}

// Function to create a folder recursively
export const createFolders = async (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(); // Resolve the promise if successful
      }
    });
  });
};

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
