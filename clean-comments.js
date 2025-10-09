const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function removeCommentsFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
   
    content = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]\/\/).*$/gm, '');
    
   
    content = content.replace(/\n{3,}/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
     
      if (!['node_modules', 'build'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(file).toLowerCase())) {
     
      if (!fullPath.includes(path.sep + 'build' + path.sep)) {
        removeCommentsFromFile(fullPath);
      }
    }
  });
}

const rootDir = path.join(__dirname);
processDirectory(rootDir);

console.log('Comment cleaning complete!');
