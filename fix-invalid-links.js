// fix-invalid-links.js
const fs = require('fs');
const path = require('path');

const targetExtensions = ['.js', '.jsx', '.ts', '.tsx'];

function scanAndFix(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanAndFix(fullPath);
    } else if (targetExtensions.includes(path.extname(entry.name))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;

      // 修正①: href={ → href={
      content = content.replace(/to\s*=\s*\{/g, 'href={');

      // 修正②: <Link href="/..."> → <Link href="/...">
      content = content.replace(/<Link\s+to\s*=\s*["']([^"']+)["']/g, '<Link href="$1"');

      // 修正③: router.push('/') → router.push('/')
      content = content.replace(/router\.push\(\s*undefined\s*\)/g, `router.push('/')`);

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ 修正済み: ${fullPath}`);
      }
    }
  });
}

// 実行
const projectRoot = path.resolve(__dirname);
scanAndFix(projectRoot);
console.log('\n✨ 自動修正が完了しました！必要に応じて git diff で確認してください。');
