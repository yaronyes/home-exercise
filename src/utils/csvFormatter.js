const fs = require('fs');

const originalHeaders = ["id","name","mac","userAgent"];

/*
Make sure that we are not adding existing columns
*/
const checkForExistingColumns = (key) => {
    return originalHeaders.includes(key);
}

/*
Creating a comma seperated header file from the original header and the extra data
*/
const createEnrichedCsvHeader = (header, uaData) => {  
    try {
        delete uaData.ua;
        var csvHeader = header;      
        for(var key in uaData) {
            // do not insert existing columns            
            if(!checkForExistingColumns(key)) {
                csvHeader += `,"${key}"`;      
            }
        }
    
        csvHeader += '\n';
        return csvHeader;        
    } catch (error) {
        console.log(`Failed to create enriched header ${error}`);
        return header;
    }    
}

/*
convert nested JSON objects to CSV.
The value: crawler: { is_crawler: false, category: null, last_seen: null }
Should change to: "is_crawler:false; category:null; last_seen:null; "
The header will be crawler.
*/
const createCsvFormatFromSecondLevel = (value) => {
    try {
        let keyValues = ',"';
        for(k in value) {
            keyValues += `${k}:${value[k.toString()]}; `;                
        }
        keyValues += '"';
    
        return keyValues;
    }
    catch (error) {
        console.log(`Failed to create enriched CSV Line from second level JSON data ${error}`);
        return "";
    }
    
}

/*
Creating dynamically CSV line from the original line and the extra data
*/
const createEnrichedCsvData = (line, uaData) => {  
    try {
        delete uaData.ua;
        var csvFormat = line;
        for(var key in uaData) {      
            if(!checkForExistingColumns(key)) {
                var keyValues = '';
                var value = uaData[key.toString()];
                if(value === null || typeof(value) !== 'object') {    
                    keyValues += `,"${value}"`;            
                } else {
                    keyValues += createCsvFormatFromSecondLevel(value);              
                }
                csvFormat += keyValues;    
            }                    
        }
    
        csvFormat += '\n';
        return csvFormat;
    } catch (error) {        
        console.log(`Failed to create enriched CSV Line ${error}`);
        return line;
    }    
}

module.exports = {
    createEnrichedCsvHeader,
    createEnrichedCsvData
}