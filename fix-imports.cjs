const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/features/lessons/use-cases');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace relative paths with aliases to avoid directory level issues
    content = content.replace(/\.\.\/\.\.\/infrastructure/g, '@/infrastructure');
    content = content.replace(/\.\.\/\.\.\/domain/g, '@/domain');
    content = content.replace(/\.\/srs-logic/g, '../srs-logic');
    
    fs.writeFileSync(filePath, content);
  }
});
console.log('Fixed imports in use-cases');
