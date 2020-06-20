const UACache = require('./UACache');
const redis = require("redis");
const { promisify } = require("util");
const config = require('../../config/config.json');

class UserAgentRedisCache extends UACache {
    constructor() {
        super();
        this.#client.on("error", function(error) {
            console.error(error);
          });                
    }

    //#region private members  
    #client = redis.createClient({
        port: config.caching.redis_connection.port,
        hsot: config.caching.redis_connection.host
    });
    #getAsync = promisify(this.#client.get).bind(this.#client);
    #setAsync = promisify(this.#client.set).bind(this.#client);
    #endAsync = promisify(this.#client.end).bind(this.#client);    
    #delAsync = promisify(this.#client.del).bind(this.#client);
    //#endregion private members

    //#region public methods
    /*
    Adding extra date received from the API to redis.
    */
    async addUserAgent(ua, data) {    
        try {
            await this.#setAsync(ua, JSON.stringify(data));
        } catch (err){
            console.log(err);
        }        
    }

    /*
    Getting the exra data for user agent from redis.
    Returns null if the user agent is not in redis.
    */
    async getUserAgent(ua) {                
        try {
            const data =  await this.#getAsync(ua);
            return JSON.parse(data);
        } catch (err){
            console.log(err);
        }        
    }

    /*
    Removing user agent from redis. currently not used.
    */
    async removeUserAgent(ua) {
        try {
            await this.#delAsync(ua);
            console.log(data);
        } catch (err){
            console.log(err);
        }                    
    }

    /* 
    Closing redis connection
    */
    async close() {               
        try {        
            await this.#endAsync(true);
        } catch (err){
            console.log(err);
        } 
    }
     //#endregion public methods
}

module.exports = UserAgentRedisCache;