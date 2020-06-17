const fs = require('fs');
const { processCsvFile } = require('./utils/csvHandler');

if(process.argv.length !== 3) {
    console.log('Missing input file path')
    return;
}    

const filePath = process.argv[2];

if(!fs.existsSync(filePath)) {
    console.log('File path is invalid')
    return;
}

processCsvFile(filePath);