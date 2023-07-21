interface ImageObject {
  url: string
  height: number
  width: number
}

interface SpotifyPlaylist {
  id: string
  name: string
  owner: string
  images: ImageObject[]
}

interface SpotifyClient {
  id: string,
  secret: string,
}

interface SpotifyTokenResponse {
  access_token: string,
  token_type: string,
  scope: string,
  expires_in: number,
  refresh_token: string
}

export { SpotifyClient, SpotifyTokenResponse, ImageObject, SpotifyPlaylist }
