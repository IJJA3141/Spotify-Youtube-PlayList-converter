import SpotifyToken from '../../../shared/spotify-token'
import 'dotenv/config'

class SpotifyClient {

  private url: string = 'https://accounts.spotify.com/api/token';

  public requestToken(): Promise<SpotifyToken> {
    var req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`
    }

    fetch(this.url, req).then(res => console.log(res)) 

    return new Promise<SpotifyToken>((resolve) => {resolve({access_token:'test', token_type:'test', expires_in:0})})
  }
}

export default SpotifyClient
