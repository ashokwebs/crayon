const fs = require('fs');
const path = require('path');

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Colors to target
  const colors = ['emerald', 'cyan', 'teal', 'violet', 'rose', 'blue', 'orange', 'amber', 'sky', 'fuchsia', 'pink', 'lime', 'green'];

  for (const color of colors) {
    // Replace background colors (e.g. bg-emerald-500)
    content = content.replace(new RegExp(`bg-${color}-[456]00`, 'g'), 'bg-zinc-800');
    content = content.replace(new RegExp(`bg-${color}-500\\/(\\d+)`, 'g'), 'bg-zinc-800/$1');
    content = content.replace(new RegExp(`bg-${color}-500\\/5`, 'g'), 'bg-zinc-800/10'); // bump opacity slightly for visibility
    
    // Replace text colors
    content = content.replace(new RegExp(`text-${color}-[456]00`, 'g'), 'text-zinc-300');
    content = content.replace(new RegExp(`text-${color}-[456]00\\/(\\d+)`, 'g'), 'text-zinc-300/$1');
    
    // Replace border colors
    content = content.replace(new RegExp(`border-${color}-[456]00`, 'g'), 'border-zinc-600');
    content = content.replace(new RegExp(`border-${color}-500\\/(\\d+)`, 'g'), 'border-zinc-600/$1');
    
    // Replace shadow colors
    content = content.replace(new RegExp(`shadow-${color}-[456]00`, 'g'), 'shadow-black');
    content = content.replace(new RegExp(`shadow-${color}-500\\/(\\d+)`, 'g'), 'shadow-black/$1');
    
    // Replace gradients
    content = content.replace(new RegExp(`from-${color}-[456]00`, 'g'), 'from-zinc-800');
    content = content.replace(new RegExp(`to-${color}-[456]00`, 'g'), 'to-zinc-950');
    content = content.replace(new RegExp(`via-${color}-[456]00`, 'g'), 'via-zinc-900');
    
    // Replace rings
    content = content.replace(new RegExp(`ring-${color}-[456]00`, 'g'), 'ring-zinc-600');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced colors in ${filePath}`);
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
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
        replaceColorsInFile(fullPath);
      }
    }
  }
}

walkDir(path.join(process.cwd(), 'src'));
