const fs = require('fs');
const { getExtraDataFromAPI } = require('./userstack');
const UserAgentCache = require('../cache/UserAgentCache');
const { createEnrichedCsvHeader, createEnrichedCsvData } = require('./csvFormatter');

/*
Writting the enriched CSV file to the disk
*/
const writeCsvFile = (filePath, fileData) => {
    // removing the newline from the latest item in the list
    fileData[fileData.length - 1] = fileData[fileData.length - 1].replace('\n', '');
    fs.writeFileSync(filePath, '');
    fileData.forEach(line => {
            fs.appendFileSync(filePath, line);
        })                            
}

/*
Read the csv and split the lines
*/
const getCsvLines = (filePath) => {
    try {
    const dataBuffer = fs.readFileSync(filePath);        
    return dataBuffer.toString().split(/\r?\n/);
    } catch (error) {        
        throw new Error(`Failed to parse CSV file: ${error}`);
    }
}

/*
Getting the extrad data. first try to get it from the cache.
If it is not in the cache, get it from the external API and save it in the cache.
*/
const getExtraData = async (uaCache, ua, index) => {
    try{
        // traying to get the extra data from the cache 
        let exraData = uaCache.getUserAgent(ua);
        if(!exraData) {                
            exraData = await getExtraDataFromAPI(ua);                
            uaCache.addUserAgent(ua, exraData);                         
        }
        return { exraData, index };
    } catch(error) {
        throw new Error(`Failed to obtain enriched sata: ${error}`) ;
    }
}

/*
Check if the CSV file allready contains extra data.
If not, return the userAgent column position
*/
const checkValidityandGetUaColumnPosition = (header) => {
    const splittedHeader = header.split(',');    
    const extraDataHeaders = ['"type"', '"brand"', '"url"', '"os"', '"device"', '"browser"', '"crawler"']
    const findExtraDataHeaders = splittedHeader.some((val) => extraDataHeaders.indexOf(val) !== -1);    
    if(findExtraDataHeaders) {
        throw new Error('It seems that you are using enriched CSV. Please try another CSV');
    }
    
    return splittedHeader.findIndex(value => value === '"userAgent"');
}

/*
The main function. reads the provided CSV file, parse it, enriche it from the cache
or from external API and save it.
Getting the extra data is done by using parallel calls.
*/
const processCsvFile = (filePath) => {
    try {
        // create the cache
        const uaCache = new UserAgentCache();                
        
        // read the CSV file
        const lines = getCsvLines(filePath);
        let header = lines[0];        
        let headerCreated = false;
        const uaColumnPosition = checkValidityandGetUaColumnPosition(header);        
        const newFileData = [];
        newFileData.push(header);
        const promises = [];
        
        console.log('Start fetching extra data');
        
        for(let i = 1; i < lines.length; i++) {
            // splitting the lines            
            const items = lines[i].split('","'); 
            const ua = items[uaColumnPosition].replace('"', '');;            
            newFileData.push(lines[i]);
            // getting the enriched data 
            promises.push(getExtraData(uaCache, ua, i));                                    
        }
        
        // waiting for all asynchronous calls
        Promise.all(promises).then(exraData => {
            exraData.forEach(data => {                
                if (data) {
                    // if we did not created the new header with the additional data - create the new header
                    if(!headerCreated) {
                        header = createEnrichedCsvHeader(header, data.exraData);                
                        headerCreated = true;
                        newFileData[0] = header;                         
                    }
                    
                    // update each line with the extra data
                    const enrichedLine = createEnrichedCsvData(newFileData[data.index], data.exraData);
                    newFileData[data.index] = enrichedLine;
                } else {
                    console.log(`Failed to enrich data for - ${data.ua}`);
                }
            })
            
            // write the enriched CSV file
            writeCsvFile(filePath, newFileData);
            console.log('CSV file is enriched');
        })                                
    } catch (error) {        
        console.log(error);
        console.log('Failed to process and enrich CSV file');
    }    
}

module.exports = {
    processCsvFile
}