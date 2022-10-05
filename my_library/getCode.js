import {constructUrl} from "./implementProtectedInfo.js"
import open from "open"

class code {
    constructor() {
        this.promise = new Promise((resolve, reject)=> {
            this.reject = reject
            this.resolve = resolve
        });
    }
}

function getCode(obj, prom){
    open(constructUrl(obj.accesUrl))
    return prom.promise
}

export {code, getCode}