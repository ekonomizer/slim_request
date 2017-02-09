# slim_request
## Description
Very slim request module for node v >=7 with 0 dependencies, for async/await requests(post,get,http,https,json,form-urlencoded).

## Usage
###Install module
```
npm install slim_request
```
###Post request, return Promise.
Params: 
host - required
path - required
params - required
json - true(default), if false request with form-urlencoded params
useHttps - true(default)

```
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
## License MIT
