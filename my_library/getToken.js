import { callAuthorizationApi } from "./callAuthorizationApi.js";
import { getCode } from "./getCode.js";
import { redirectUri } from "./implementProtectedInfo.js";

async function getTokens(obj, prom) {
  let code = getCode(obj, prom);
  let body = "grant_type=authorization_code";
  body += "&code=" + await code;
  body +=
    "&redirect_uri=" + encodeURI(redirectUri + "/loginresponse/" + obj.name);
  body += "&client_id=" + obj.clientId;
  body += "&client_secret=" + obj.clientSecret;

  let response = callAuthorizationApi(obj, body)
  console.log(await response)
  if ((await response).status == 200){
    let data = JSON.parse(response.responseText)
    console.log(data.access_token)
  }
}

export { getTokens };
