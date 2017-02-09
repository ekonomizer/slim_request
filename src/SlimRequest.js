'use strict';
const http = require('http');
const https = require('https');
const Querystring = require('querystring');
let debug = false;
let log = null;
class SlimRequest {

    static debugMode(v = true, userLog = console) {
        debug = v;
        log = userLog;
    }

    static post(host, path, params, port, json = true, useHttps=true) {
        return new Promise((resolve, reject) => {

            if (debug)
                log.debug("Send Post", {host, port, path, params, json, useHttps});

            var type;
            var postData;
            if (json) {
                type = "application/json";
                postData = JSON.stringify(params)
            } else {
                type = "application/x-www-form-urlencoded";
                postData = Querystring.stringify(params)
            }

            var postOptions = {
                host: host, //'closure-compiler.appspot.com'
                path: path,  //'/compile'
                method: 'POST',
                headers: {
                    'Content-Type': type,
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            if (port)
                postOptions.port = port;

            if (debug)
                log.debug('postOptions', postOptions);

            let protocol = useHttps? https : http;
            let postReq = protocol.request(postOptions, (res)=> {
                res.setEncoding('utf8');
                res.once('data', (chunk)=> {
                    if (debug)
                        log.debug("Remote host response", {chunk: chunk});
                    resolve(chunk);
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

            postReq.write(postData);
            postReq.end();
        })
    }

    static get(host, path, params) {
        return new Promise((resolve, reject) => {

            if (params) {
                var urlParams = "?";

                for (let k in params) {
                    if (urlParams != "?")
                        urlParams += `&${k}=${params[k]}`;
                    else
                        urlParams += `${k}=${params[k]}`
                }
                path += urlParams + `&sig=${sig}`;
            }

            let postReq = http.request({host, path}, (res)=> {
                res.setEncoding('utf8');
                res.once('data', (chunk)=> {
                    if (debug)
                        log.debug("Remote host response", {chunk: chunk});
                    resolve(chunk);
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
}

module.exports = SlimRequest;