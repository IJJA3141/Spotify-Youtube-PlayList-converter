class spotify_playlist{
  constructor(_playlist_id:string){
    this._playlist_id = _playlist_id;
  }

  public async spotify_fetch(){
  `https://api.spotify.com/v1/playlists/${this._playlist_id}/tracks`
  }

  private _playlist_id:string;
}
