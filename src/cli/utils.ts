import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

export function log(message: string): void {
  console.log(message);
}

export function success(message: string): void {
  console.log(`\x1b[32m✔\x1b[0m ${message}`);
}

export function error(message: string): void {
  console.error(`\x1b[31m✖\x1b[0m ${message}`);
}

export function warn(message: string): void {
  console.warn(`\x1b[33m⚠\x1b[0m ${message}`);
}

export function info(message: string): void {
  console.log(`\x1b[36mℹ\x1b[0m ${message}`);
}

export function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export function writeFile(filePath: string, content: string): void {
  const dir = dirname(filePath);
  if (dir && dir !== '.') ensureDir(dir);
  writeFileSync(filePath, content, 'utf-8');
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function getCwd(): string {
  return process.cwd();
}

// Re-export join for convenience
export { join };
