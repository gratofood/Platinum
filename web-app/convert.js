import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('public/logo.png');
const bytes = fs.readFileSync(logoPath);
const base64 = bytes.toString('base64');

const content = `export const LOGO_BASE64 = "data:image/png;base64,${base64}";\n`;
fs.writeFileSync(path.resolve('src/logoData.js'), content);
console.log('Successfully created logoData.js with base64 size:', base64.length);
