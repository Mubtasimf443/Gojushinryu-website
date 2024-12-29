/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import fetch from "node-fetch";
import { log } from "string-player";

export async function POST(url,json={},options={ headers :{"Content-Type" :"application/json"},params:undefined,giveDetails :undefined}) {
    if (!options) options={};
    if (typeof options.headers !== 'object') options.headers = {};
    if (typeof options.params === 'object') {
        url=url+'?'+(new URLSearchParams(options.params)).toString()
    }
    options.headers["Content-Type"]= options.headers["Content-Type"] ?? "application/json";
    let response=await fetch(url, {
        method :'POST',
        headers :options.headers,
        body :JSON.stringify(json)
    });
    if (options.giveDetails) {
        let status=response.status,json=await response.json().catch(jsonErrorHandler)
        return {
            status,
            json
        }
    }
    response=await response.json().catch(jsonErrorHandler);
    return response
}

export async function GET(url,options= {headers :{},params:undefined,giveDetails :undefined}) {
    if (!options) options={};
    if (typeof options.headers !== 'object') options.headers = {};
    if (typeof options.params === 'object') {
        url=url+'?'+(new URLSearchParams(options.params)).toString()
        log(url);
    }
    let response=await fetch(url,{
        headers :options.headers
    })
    if (options.giveDetails) {
        let status=response.status,json=await response.json().catch(jsonErrorHandler)
        return {
            status,
            json
        }
    }
    response=await response.json().catch(jsonErrorHandler);
    return response
}
export function jsonErrorHandler(error) {
    return ({
        error :'unexpected end of json data'
    })
}

class F {
    constructor(parameters) {
        
    }
    GET=GET;
    POST=POST;
    get=GET;
    post=POST;
}



const request=new F();
export default request