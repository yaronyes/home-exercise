const config = require('../../config/config.json');
const uaData = require('../../mock/mockData');
const axios = require('axios');

/*
Calling userstack's api to get the extra data.
For the development phase, I used bypass the API call by retriving hardcoded data located in mockData.js file
The moce can be enabled in the configuration file (config.json) by setting the "using_mock" parameter to true. 
*/
const getExtraDataFromAPI = async (ua) => {    
    if (config.userstack_api.using_mock) {
        uaData.ua = ua;
        console.log(`running in mock state - fetching data for ${ua}`);
        return uaData;
    }
    
    const url = `${config.userstack_api.api_url}?access_key=${config.userstack_api.api_key}&ua=${ua}`;
    
    try {        
        const response = await axios.get(url);        
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get data from userstack's API: ${error}`);
    }
}

module.exports = {
    getExtraDataFromAPI
}