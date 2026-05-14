const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('toc.txt', pdfParser.getRawTextContent().substring(0, 15000));
    console.log("Done");
});

pdfParser.loadPDF("docs/referencias/Charts Of Biblical Hebrew (Miles V Van Pelt, Gary D Pratico) (z-library.sk, 1lib.sk, z-lib.sk).pdf");
