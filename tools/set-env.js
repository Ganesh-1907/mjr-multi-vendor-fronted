const fs = require('fs');
const path = require('path');

let BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    BACKEND_URL = envContent
      .split('\n')
      .find(line => line.startsWith('BACKEND_URL='))
      ?.split('=')
      .slice(1)
      .join('=')
      ?.trim();
  }
}

if (!BACKEND_URL) {
  console.error('BACKEND_URL not found. Set it via environment variable or .env file.');
  process.exit(1);
}

const envDir = path.join(__dirname, '..', 'src', 'environments');
if (!fs.existsSync(envDir)) fs.mkdirSync(envDir, { recursive: true });

const template = (production) => `export const environment = {
  production: ${production},
  apiBaseUrl: '${BACKEND_URL}'
};
`;

fs.writeFileSync(path.join(envDir, 'environment.ts'), template(false));
fs.writeFileSync(path.join(envDir, 'environment.development.ts'), template(false));

console.log(`✓ Environment files generated (BACKEND_URL: ${BACKEND_URL})`);
