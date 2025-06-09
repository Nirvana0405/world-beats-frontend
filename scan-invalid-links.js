// scan-invalid-links.js
const fs = require('fs');
const path = require('path');

const targetExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const suspiciousPatterns = [
  /to\s*=\s*\{/,
  /router\.push\(\s*undefined\s*\)/,
  /<Link\s+to\s*=/,
  /href\s*=\s*\{/,
];

function scanDir(dir) {
  const results = [];

  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath));
    } else if (targetExtensions.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, i) => {
        suspiciousPatterns.forEach((pattern) => {
          if (pattern.test(line)) {
            results.push({
              file: fullPath,
              line: i + 1,
              content: line.trim(),
              pattern: pattern.toString(),
            });
          }
        });
      });
    }
  });

  return results;
}

// 実行部分
const projectRoot = path.resolve(__dirname);
const results = scanDir(projectRoot);

if (results.length === 0) {
  console.log('✅ 問題のある "to=" や router.push('/') は見つかりませんでした。');
} else {
  console.log('⚠️ 問題のある記述を発見しました:');
  results.forEach(({ file, line, content, pattern }) => {
    console.log(`\nFile: ${file}`);
    console.log(`Line: ${line}`);
    console.log(`Pattern: ${pattern}`);
    console.log(`Code: ${content}`);
  });
}
