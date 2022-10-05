import open from "open"

export class code {
    constructor() {
        this.Promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export default function getCode(obj, prom){
    open(obj.accesUrl)
    return prom.promise
}