const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const processFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanContent = strip(content, {
      preserveNewlines: true,
      safe: true
    });
    
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
};

const processDirectory = (directory) => {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  });
};

const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
}

const rootDir = __dirname;
const rootFiles = fs.readdirSync(rootDir);
rootFiles.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx')) {
    processFile(path.join(rootDir, file));
  }
});

console.log('Comment removal complete!');
