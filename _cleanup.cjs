const Database = require('node:sqlite');
const db = new Database.DatabaseSync('D:/AI类/自己AI项目文件夹/SkillNest 技能巢/skillnest_extracted/data/skillnest.db');
const sid = '44a7eff0-b542-40e9-a237-1d55c95ba97e';
const before = db.prepare('SELECT COUNT(*) as c FROM files WHERE skill_id=? AND name IN (?,?)').get(sid, 'main.ts', 'config.json');
console.log('orphan files:', before.c);
db.prepare('DELETE FROM files WHERE skill_id=? AND name IN (?,?)').run(sid, 'main.ts', 'config.json');
const after = db.prepare('SELECT COUNT(*) as c FROM files WHERE skill_id=?').get(sid);
console.log('files after cleanup:', after.c);
