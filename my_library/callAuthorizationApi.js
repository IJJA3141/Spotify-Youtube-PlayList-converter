import fetch from "node-fetch";

function callAuthorizationApi(body){
    fetch(obj.tokenUrl, {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded", "Authorization":
    "Basic " +
      btoa(
        obj.clientId + ":" + obj.clientSecret
      )}, body: body})
}

export {callAuthorizationApi}