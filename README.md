# slim_request
## Description
Very slim request module for node v >=7 with 0 dependencies, for async/await requests(post,get,http,https,json,form-urlencoded).

## Usage
###Install module
```
npm install slim_request
```
###Post request, return Promise.
```
Params: 
host - required
path - required
params - required
json - true by default , if false request with form-urlencoded params
useHttps - true by default

const request = requiere('slim_request');
const host = 'github.com';
const path = '/ekonomizer/slim_request/';
const params = {someparams};
try {
  let body = await request.post(host, path, params); 
} catch(e) {
  throw(e);
}
```

###Get request, return Promise.
```
Params:
host - required
path - required
params - not required, url params in object.

const request = requiere('slim_request');
const host = 'github.com';
const path = '/ekonomizer/slim_request/';
const params = {someparams};
try {
  let body = await request.post(host, path, params);
} catch(e) {
  throw(e);
}
```

###Debug mode. You can enable debug mode, and set logger in module.
```
Params:
enableDebug - true by default
logger - console.log by default

const request = requiere('slim_request');
const enableDebug = true;
const logger = CustomUserLoggerWithMethodsDebugAndWarn();
request.debugMode(enableDebug, logger)
```
## License MIT
