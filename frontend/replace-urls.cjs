const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/hp126/.gemini/antigravity/scratch/BusGo/frontend/src';

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:5000')) {
    // We want to replace 'http://localhost:5000/' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/`
    content = content.replace(/'http:\/\/localhost:5000\//g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/");
    
    // Some urls might not end with slash, let's catch them too if there are any
    content = content.replace(/'http:\/\/localhost:5000'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`");
    
    // Oh wait! The string literals in JS must be replaced to template literals! 
    // It's safer to just create a config file and import it, or do a regex that swaps the quotes.
    
    // Actually, simple regex for string literals starting with 'http://localhost:5000
    // We can replace the whole string to template literal.
    const regex = /'http:\/\/localhost:5000(.*?)'/g;
    content = content.replace(regex, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
};

const walk = (d) => {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) replaceInFile(p);
  });
};

walk(dir);
