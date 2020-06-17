const fs = require('fs');
const path = require('path');

// the cache file location.
const CACHE_FILE = path.join(__dirname, '../../cache_file/user_agents.json'); 

class UserAgentCache {
    constructor() {
        // private methods
        saveUserAgents.bind(this);
        loadUserAgents.bind(this);        
    }
     
    //#region private members    
    #userAgents = loadUserAgents();    
    //#endregion private members
    
    //#region public methods
    
    /*
    Adding extra date received from the API to the cache.
    */
    addUserAgent(ua, data)  {            
        this.#userAgents.push({
            ua,
            data
        })
    
        // saving the cache file
        saveUserAgents(this.#userAgents);             
    }

    /*
    Getting the exra data for user agent from the cache.
    Returns undefined if the user agent is not in the cache.
    */
    getUserAgent(ua) {                
        const userAgent = this.#userAgents.find((agent) => agent.ua === ua);
        return userAgent ? userAgent.data : undefined;
    }
    
    /*
    Removing user agent from the cache. currently not used.
    */
    removeUserAgent(ua) {        
        try {
            const afterRemoval = this.#userAgents.filter((agent) => agent.ua !== ua);
        
            if(afterRemoval.length !== userAgents.length) {
                this.#userAgents = afterRemoval;
                saveUserAgent(afterRemoval);        
            }
        } catch (error) {
            console.log(error);    
        }
    }
    //#endregion public methods
}

/*
saving the cache file
*/
const saveUserAgents = (userAgents) => {
    try {
        const buffer = JSON.stringify(userAgents);        
        fs.writeFile(CACHE_FILE, buffer, err => {
            if (err) 
                throw err;            
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/*
Loading the cache file
*/
const loadUserAgents = () => {    
    try{
        const dataBuffer = fs.readFileSync(CACHE_FILE);                
        return JSON.parse(dataBuffer.toString());
    }catch (error) {
        return [];
    }
}

module.exports = UserAgentCache;