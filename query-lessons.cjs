const Database = require('better-sqlite3');
const db = new Database('local.db');
const lessons = db.prepare('SELECT id, title, `order` FROM lessons ORDER BY `order` ASC LIMIT 30').all();
console.table(lessons);
