import fetch from "node-fetch";

async function callAuthorizationApi(obj, body) {
  let response = await fetch(obj.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(obj.clientId + ":" + obj.clientSecret),
    },
    body: body,
  });
  return response;
}

export { callAuthorizationApi };
