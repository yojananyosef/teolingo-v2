const fs = require('fs');
const path = 'src/infrastructure/database/seed-lessons.ts';
const lines = fs.readFileSync(path, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function ')) {
    console.log(`Line ${i+1}: ${lines[i]}`);
  }
}
