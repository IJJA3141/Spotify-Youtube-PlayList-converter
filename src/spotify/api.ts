import { SpotifyClient, SpotifyPlaylist } from "./spotify-types";
import Token from "./token";

class SpotifyApi {
  private clientId_: string = '';
  private token_: Token

  constructor(_client: SpotifyClient) {
    this.token_ = new Token(_client);

    this.token_.get().then((_token: string) => {
      fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${_token}` }
      }).then((_res: Response) => { _res.json().then((_data) => { this.clientId_ = _data.id }) })
    })
  }

  public playlists(): Promise<Array<SpotifyPlaylist>> {
    return new Promise<Array<SpotifyPlaylist>>((_resolve) => {
      let playlists: Array<SpotifyPlaylist> = []
      let offset: number = 0;
      let stop = false;
      let it = 0;

      //while (!stop) {
      this.token_.get().then((_token: string) => {
        fetch(`https://api.spotify.com/v1/users/${this.clientId_}/playlists?limit=50&offset=${offset}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${_token}` }
        }).then((_res: Response) => {
          _res.json().then((_data) => {
            _data.items.forEach((playlist: SpotifyPlaylist) => {
              console.log(playlists)
              playlists.push({
                id: playlist.id,
                name: playlist.name,
                owner: playlist.owner,
                images: playlist.images
              })
              if (_data.next === null || _data.next === undefined) stop = true
            });
          })
        })
      })
      offset += 50
      console.log(it++);
      if (it > 100) //break
        //}
        _resolve(playlists)
    })
  }
}

export default SpotifyApi
