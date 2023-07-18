interface SpotifyClient{
  id:string,
  secret:string,
}

interface SpotifyTokenResponse{
  access_token:string,
  token_type:string,
  scope:string,
  expires_in:number,
  refresh_token:string
}

export {SpotifyClient, SpotifyTokenResponse}
