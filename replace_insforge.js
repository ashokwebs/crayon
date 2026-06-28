const fs = require('fs');
const path = require('path');

const TARGET_DIRS = ['src', 'public'];
const TARGET_FILES = ['README.md', 'project_story.md', 'package.json', 'tsconfig.json'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

function replaceInFile(filePath) {
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('.next') || filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.ico') || filePath.endsWith('.webp')) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  content = content.replace(/InsForge/g, 'Aicoo');
  content = content.replace(/insforge/g, 'aicoo');
  content = content.replace(/INSFORGE/g, 'AICOO');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

TARGET_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = walk(dir);
    files.forEach(replaceInFile);
  }
});

TARGET_FILES.forEach(file => {
  if (fs.existsSync(file)) {
    replaceInFile(file);
  }
});

console.log("Done");
