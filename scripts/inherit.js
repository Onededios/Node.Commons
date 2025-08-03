const { execSync } = require('child_process');
const glob = require('glob');
const path = require('path');

const base = path.resolve(__dirname, '../base.package.json');
const pkgs = glob.sync('../packages/*/package.json', { cwd: __dirname });

if (!pkgs.length) {
  console.warn('No se encontraron package.json en ./packages/');
  process.exit(0);
}

pkgs.forEach((pkgJson) => {
  const absPkgJson = path.resolve(__dirname, pkgJson);

  try {
    console.log(`Procesando: ${pkgJson}`);
    execSync(`npx inherit "${base}" "${absPkgJson}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error procesando ${pkgJson}: ${error.message}`);
    process.exit(1);
  }
});

console.log('Herencia de package.json completada.');
