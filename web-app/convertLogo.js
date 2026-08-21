import fs from 'fs';
const img = fs.readFileSync('d:/GitHub/android.app/interior_design_bot/web-app/public/photos/platinum-official-logo.jpg');
const b64 = 'data:image/jpeg;base64,' + img.toString('base64');
fs.writeFileSync('d:/GitHub/android.app/interior_design_bot/web-app/src/logoData.js', `export const LOGO_BASE64 = "${b64}";\n`);
console.log('Logo Base64 written to logoData.js, length:', b64.length);
