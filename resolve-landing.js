const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\aryus\\Downloads\\HACK\\aexsquad04\\index.html', 'utf8');
const lines = content.split('\n');

let headContent = '<!DOCTYPE html>\n<html lang="en">\n';
let inHead = false;
for (let line of lines) {
    if (line.includes('<<<<<<< HEAD')) {
        inHead = true;
        continue;
    }
    if (line.includes('=======')) {
        break;
    }
    if (inHead) {
        headContent += line + '\n';
    }
}

// Replace buttons to route to dashboard cleanly
headContent = headContent.replace(
    /onclick="window\.location\.href='http:\/\/localhost:5173\/'"/g,
    `onclick="window.parent.location.href='/dashboard'"`
);

fs.writeFileSync('c:\\Users\\aryus\\Downloads\\HACK\\aexsquad04\\route-app\\public\\home.html', headContent);
console.log("home.html extracted and saved.");
