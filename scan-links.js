// scan-links.js
const fs = require('fs');
const path = require('path');

const targetDirs = ['pages', 'components'];
const targetExt = ['.ts', '.tsx'];

const checkLine = (line, filePath, lineNum) => {
  if (line.includes('router.push(')) {
    if (!line.includes("'") && !line.includes('"') && !line.includes('`')) {
      console.log(`[警告] router.push の未定義使用の可能性あり: ${filePath}:${lineNum + 1}`);
      console.log(`  → ${line.trim()}`);
    }
  }
  if (line.includes('<Link') && line.includes('href={')) {
    if (!line.includes('"') && !line.includes("'") && !line.includes('`')) {
      console.log(`[警告] <Link href=...> に変数を使用: ${filePath}:${lineNum + 1}`);
      console.log(`  → ${line.trim()}`);
    }
  }
};

const scanFile = (filePath) => {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  lines.forEach((line, idx) => checkLine(line, filePath, idx));
};

const walkDir = (dir) => {
  fs.readdirSync(dir).forEach((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (targetExt.includes(path.extname(entry))) {
      scanFile(fullPath);
    }
  });
};

// 実行
targetDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  } else {
    console.warn(`[スキップ] ディレクトリが見つかりません: ${dir}`);
  }
});
