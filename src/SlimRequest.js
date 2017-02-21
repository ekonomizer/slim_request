'use strict';
const http = require('http');
const https = require('https');
const Querystring = require('querystring');
let debug = false;
let cache = false;
let log = {debug: (...args)=>{console.log(...args)}, info: (...args)=>{console.log(...args)},warn: (...args)=>{console.log(...args)},fatal: (...args)=>{console.log(...args)}};
let savedRequests = {};
class SlimRequest {

    static send(params) {
        params = SlimRequest.prepareUrl(params);
        if (params.method == "post" || params.method == "POST" )
            return SlimRequest.post(params);
        else
            return SlimRequest.get(params);
    }

    static checkRequestParams(params) {
        if(!params.method)
            throw(new Error("Post request need method post or get."));
        if (!params.url && !params.host)
            throw(new Error("Post request need host or url params."));
    }

    static prepareUrl(params) {
        if (params.alias && savedRequests[params.alias]) {
            savedRequests[params.alias].data = params.data || savedRequests[params.alias].data;
            return savedRequests[params.alias];
        }



        SlimRequest.checkRequestParams(params);
        if (params.url) {
            let parts = params.url.split('://');
            if (parts.length != 2)
                throw new Error("Url must be like: http://somedomain.com");
            params.https = parts[0] === 'https';

            let hostLength = parts[1].indexOf('/');

            let hostPath = parts[1].split('/');
            let host = hostPath.shift();
            let hostPort = host.split(':');
            params.host = hostPort[0];
            params.port = hostPort[1];

            let path = "/" + hostPath.join('/');
            if (path.indexOf('?') != -1) {
                let pathParams = path.split('?');
                path = pathParams[0];

            }
            params.path = path;
            params.url = null;
        }

        if (params.https == null || params.https == undefined)
            params.https = true;
        if (params.json == null || params.json == undefined)
            params.json = true;

        if (cache && params.alias)
            SlimRequest.saveRequest(params);
        return params;
    }

    static post(params) {
        return new Promise((resolve, reject) => {
            if (debug)
                log.debug("Send Post", params);

            var type;
            var postData;
            if (params.json) {
                type = "application/json";
                postData = JSON.stringify(params.data || {})
            } else {
                type = "application/x-www-form-urlencoded";
                postData = Querystring.stringify(params.data || {})
            }

            var postOptions = {
                host: params.host, //'closure-compiler.appspot.com'
                path: params.path,  //'/compile'
                method: 'POST',
                headers: {
                    'Content-Type': type,
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            if (params.port)
                postOptions.port = params.port;

            if (debug)
                log.debug('postOptions', postOptions);

            let protocol = params.https? https : http;
            let postReq = protocol.request(postOptions, (res)=> {
                let data = '';
                res.setEncoding('utf8');
                res.once('data', (chunk)=> {
                    if (debug)
                        log.debug("Remote host response", {chunk: chunk});
                    data += chunk;
                });
                res.once('end', ()=> {
                    if (debug)
                        log.debug('No more data in response.');
                    resolve({statusCode: res.statusCode, headers: res.headers, body: data});
                    res.removeAllListeners();
                })
            });

            postReq.on('error', (e)=> {
                if (debug)
                    log.warn("Problem with request", {err: e});
                postReq.removeAllListeners();
                reject(e);
            });

            postReq.on('response', ()=> {
                postReq.removeAllListeners();
            });

            postReq.write(postData);
            postReq.end();
        })
    }

    static get(params) {
        return new Promise((resolve, reject) => {
            if (params.data) {
                var urlParams = "?";

                for (let k in params.data) {
                    if (urlParams != "?")
                        urlParams += `&${k}=${params.data[k]}`;
                    else
                        urlParams += `${k}=${params.data[k]}`
                }
                params.path += urlParams;
            }

            let postReq = http.request(params, (res)=> {
                res.setEncoding('utf8');
                res.once('data', (chunk)=> {
                    if (debug)
                        log.debug("Remote host response", {chunk: chunk});
                    resolve({statusCode: res.statusCode, headers: res.headers, body: chunk});
                });
                res.once('end', ()=> {
                    if (debug)
                        log.debug('No more data in response.');
                    res.removeAllListeners();
                })
            });
            postReq.on('error', (e)=> {
                if (debug)
                    log.warn("Problem with request", {err: e});
                postReq.removeAllListeners();
                reject(e);
            });

            postReq.on('response', ()=> {
                postReq.removeAllListeners();
            });

            postReq.end();
        });
    }


    static saveRequest(params) {
        savedRequests[params.alias] = params;
    }

    static checkRequestsAndSave(requests) {
        if (!requests || typeof requests !== "object")
            return;
        if (Object.keys(requests).indexOf("requests") == -1) {
            for (let name in requests) {
                SlimRequest.checkRequestsAndSave(requests[name]);
            }
            return;
        }

        for (let request of requests.requests) {
            SlimRequest.prepareUrl(request);
        }
    }

    static loadRequests(cfg) {
        for (let name of cfg.requests) {
            SlimRequest.checkRequestsAndSave(cfg[name])
        }
    }

    static debugMode(v = true, userLog ) {
        debug = v;
        log = log || userLog;
    }

    static cacheMode(v = true) {
        cache = v;
    }

    static get savedRequests() {
        return savedRequests
    }
}

module.exports = SlimRequest;
