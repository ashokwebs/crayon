const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('vector-ai.com') || content.includes('vector.com') || content.includes('vector.859b456b')) {
    const newContent = content
      .replace(/vector-ai\.com/g, 'crayon.com')
      .replace(/vector\.com/g, 'crayon.com')
      .replace(/vector\.859b456b/g, 'crayon.859b456b');
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Replaced emails in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('.git') && !fullPath.includes('node_modules') && !fullPath.includes('.next')) {
        walkDir(fullPath);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md') || fullPath.endsWith('.css') || fullPath.endsWith('.txt')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(path.join(process.cwd(), 'src'));
walkDir(path.join(process.cwd(), 'public'));
replaceInFile(path.join(process.cwd(), 'README.md'));
replaceInFile(path.join(process.cwd(), 'project_story.md'));
replaceInFile(path.join(process.cwd(), 'script.txt'));
