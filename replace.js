const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('Vector') || content.includes('vector')) {
    const newContent = content
      .replace(/Vector AI/g, 'Crayon AI')
      .replace(/Vector OS/g, 'Crayon OS')
      .replace(/Vector Command/g, 'Crayon Command')
      .replace(/Project Vector/g, 'Project Crayon')
      .replace(/Vector/g, 'Crayon')
      .replace(/vector_logo/g, 'crayon_logo')
      .replace(/vector_model/g, 'crayon_model')
      .replace(/vector_temperature/g, 'crayon_temperature')
      .replace(/vector_memory/g, 'crayon_memory')
      .replace(/vector_/g, 'crayon_');
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Replaced in ${filePath}`);
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
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.md') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
        replaceInFile(fullPath);
      }
    }
  }
}

walkDir(path.join(process.cwd(), 'src'));
walkDir(path.join(process.cwd(), 'public'));
replaceInFile(path.join(process.cwd(), 'project_story.md'));
replaceInFile(path.join(process.cwd(), 'package.json'));
