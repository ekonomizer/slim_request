# slim_request
## Description
Very slim request module for node v >=7 with 0 dependencies, for async/await requests(post,get,http,https,json,form-urlencoded).

## Usage
###Install module
```
npm install slim_request
```
###Send request, return Promise.
Params: 
```
url - full address(http://github.com:80), string
host - host name (github.com), string
path - (/ekonomizer/slim_request), string
port - not required, int
data - request params, object
json - request params format, boolean, true by default, if false request with form-urlencoded params
https - protocol, boolean, true by default

const request = require('slim_request');
const url = "https://github.com:80/ekonomizer/slim_request"
try {
  let res = await request.send({method: 'get', url});
  console.log(res.body, res.statusCode, res.headers);
} catch(e) {
  throw(e);
}
```

###Custom params. You can set custom params:
```
const request = require('slim_request');
const params = {};
params.host = 'github.com';
params.path = '/ekonomizer/slim_request';
params.port = 80;
params.method = 'post';
pararms.json = false;
params.data = {somedata};

try {
  let res = await request.post(params);
  console.log(res.body, res.statusCode, res.headers);
} catch(e) {
  throw(e);
}
```

###Cache mode. You can enable cache mode(module save you request params, and they are available by alias)
```
let request = require('slim_request');

request.cacheMode(true);

const params = {};
params.host = 'github.com';
params.method = 'post';
params.data = {somedata};
params.alias = 'github slim request';

try {
  let res = await request.send(params);
  console.log(res.body, res.statusCode, res.headers)
} catch(e) {
  throw(e);
}

params = {};
params.data = {someOtherData}; // can send request without new params(with old)
params.alias = 'github slim request';
try {
  let res = await request.send(params);
  console.log(res.body, res.statusCode, res.headers)
} catch(e) {
  throw(e);
}
```
Or you can save requests, before send.
```
let request = require('slim_request');

request.cacheMode(true);

const params = {};
params.host = 'github.com';
params.method = 'post';
params.data = {somedata};
params.alias = 'github slim request';

request.saveRequest(params);
console.log(requests.savedRequests);

try {
  let res = await request.send({alias: 'github slim request'});
  console.log(res.body, res.statusCode, res.headers)
} catch(e) {
  throw(e);
}
```

###PreLoad requests from config.
####You can preload config vith request params to slim_request.
```
Important - config must have object requests with array request params.
let request = require('slim_request');
const config = {
    payments: {
        ios: {
            requests: [{
                alias: "ios_real",
                url: "https://buy.itunes.apple.com:443/verifyReceipt",
                json: false,
                method: "post"},
                {alias: "ios_test",
                url: "https://sandbox.itunes.apple.com:443/verifyReceipt",
                method: "post"}
            ]
        }
    }
}

request.cacheMode(true);
request.loadRequests(config);
console.log(request.savedRequests);

try {
  let res = await request.send({alias: 'ios_real', {data}});
  console.log(res.body, res.statusCode, res.headers)
} catch(e) {
  throw(e);
}
```
###Debug mode. You can enable debug mode, and set logger in module.
```
Params:
enableDebug - true by default
logger - console.log by default

const request = require('slim_request');
const enableDebug = true;
const logger = CustomUserLoggerWithMethodsDebugAndWarn();
request.debugMode(enableDebug, logger)
```
## License MIT
