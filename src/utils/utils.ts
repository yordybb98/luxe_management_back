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
