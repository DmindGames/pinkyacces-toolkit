import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { success, error, warn, info, getCwd } from '../utils.js';

interface CheckResult {
  passed: boolean;
  message: string;
}

function checkNodeVersion(): CheckResult {
  const version = process.version;
  const major = parseInt(version.split('.')[0].replace('v', ''), 10);
  if (major >= 18) {
    return { passed: true, message: `Node.js ${version} ✓` };
  }
  return { passed: false, message: `Node.js ${version} - Se requiere >= 18.0.0` };
}

function checkPinkyConfig(): CheckResult {
  const cwd = getCwd();
  const configPath = join(cwd, 'pinky.config.js');
  if (existsSync(configPath)) {
    return { passed: true, message: 'pinky.config.js encontrado ✓' };
  }
  return { passed: false, message: 'pinky.config.js no encontrado. Ejecuta: pinky init' };
}

function checkPackageJson(): CheckResult {
  const cwd = getCwd();
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    return { passed: false, message: 'package.json no encontrado' };
  }
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
    const deps = { ...(pkg.dependencies as Record<string, string> ?? {}), ...(pkg.devDependencies as Record<string, string> ?? {}) };
    if ('pinkyacces-toolkit' in deps) {
      return { passed: true, message: `pinkyacces-toolkit en dependencias (${deps['pinkyacces-toolkit']}) ✓` };
    }
    return { passed: false, message: 'pinkyacces-toolkit no encontrado en package.json' };
  } catch {
    return { passed: false, message: 'Error al leer package.json' };
  }
}

function checkTourConfig(): CheckResult {
  const cwd = getCwd();
  const tourPath = join(cwd, 'pinky-tour.config.js');
  if (existsSync(tourPath)) {
    return { passed: true, message: 'pinky-tour.config.js encontrado ✓' };
  }
  return { passed: false, message: 'pinky-tour.config.js no encontrado. Ejecuta: pinky tour:init' };
}

export async function runDoctor(): Promise<void> {
  console.log('\n🩺 Pinky Doctor - Validando configuración del proyecto\n');

  const checks: CheckResult[] = [
    checkNodeVersion(),
    checkPackageJson(),
    checkPinkyConfig(),
    checkTourConfig(),
  ];

  let allPassed = true;

  for (const check of checks) {
    if (check.passed) {
      success(check.message);
    } else {
      error(check.message);
      allPassed = false;
    }
  }

  console.log('');
  if (allPassed) {
    success('Todo en orden. Tu proyecto está listo para usar pinkyacces-toolkit.');
  } else {
    warn('Hay problemas que resolver. Revisa los mensajes anteriores.');
    info('Documentación: https://github.com/DmindGames/pinkyacces-toolkit');
  }
}
