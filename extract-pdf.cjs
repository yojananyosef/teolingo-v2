const fs = require('fs');
const pdf = require('pdf-parse');

async function extractTOC() {
  const dataBuffer = fs.readFileSync('docs/referencias/Charts Of Biblical Hebrew (Miles V Van Pelt, Gary D Pratico) (z-library.sk, 1lib.sk, z-lib.sk).pdf');
  
  try {
    const data = await pdf(dataBuffer, { max: 15 }); // Read first 15 pages for TOC
    console.log(data.text);
  } catch (error) {
    console.error('Error reading PDF:', error);
  }
}

extractTOC();
