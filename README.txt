The program is written in Node.js. Please install latest node before running the program and run npm install in the home-exercise folder.
In order to run the program, please run the program from home-exercise folder.

Added support for redis. see configuration below.


Running the program
--------------------
Run the program by typing: npm run start [CSV file path]
Example: npm run start E:\Code\projects\test\devices.csv


configuration
--------------
The configuration file located under the config folder.

{
    "userstack_api": {
        "api_key": "", --> the API access key. Please add one
        "api_url": "http://api.userstack.com/detect",  --> the API URL
        "using_mock": false  --> for development phase. true fro using mock data
    },
    "caching": {
        "useRedis": false,    --> set to true if you want to use redis for caching
        "redis_connection": {
            "host": "127.0.0.1",
            "port": "6379"
        }        
    }   
}