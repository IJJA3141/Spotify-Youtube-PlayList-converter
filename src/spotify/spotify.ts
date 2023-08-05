import { MainProcess } from "../main";
import { client, playlist } from "../types";

class Spotify {
  public playlists: playlist[];

  private playlistPromise_: any;
  private main_: MainProcess;
  private client_: client;
  private token_!: string;
  private pResolveCode_: any;
  private userId_!: string;
  private offset_: number;

  public constructor(_main: MainProcess) {
    this.main_ = _main;
    this.offset_ = 0;
    this.playlists = [];
    this.client_ = {
      id: process.env.SPOTIFY_CLIENT_ID as string,
      secret: process.env.SPOTIFY_CLIENT_SECRET as string,
    };
  }

  public async init(): Promise<void> {
    let pCode: Promise<string> = new Promise<string>((_resolve) => {
      this.pResolveCode_ = _resolve;
    });

    this.main_.open(
      `https://accounts.spotify.com/authorize?response_type=code&scope=playlist-read-private&redirect_uri=http://localhost:3000&client_id=${this.client_.id}`,
      this.pResolveCode_,
    );

    const code: string = (await pCode).slice(28);

    let res: Response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${this.client_.id}:${this.client_.secret}`,
        )}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURI(
        "http://localhost:3000",
      )}&client_id=${this.client_.id}&client_secret=${this.client_.secret}`,
    });

    let data: any = await res.json();

    this.token_ = await data.access_token;

    res = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${this.token_}` },
    });

    data = await res.json();
    this.userId_ = data.id;

    this.playlist_();

    return new Promise<void>((_resolve) => {
      this.playlistPromise_ = _resolve;
    });
  }

  private async playlist_(): Promise<void> {
    const res = await this.fetchPlaylist_();
    if (res) this.playlist_();
    else {
      this.playlistPromise_();
      return new Promise<void>((_resolve) => {
        _resolve();
      });
    }
  }

  private async fetchPlaylist_(): Promise<boolean> {
    const res: Response = await fetch(
      `https://api.spotify.com/v1/users/${this.userId_}/playlists?limit=50&offset=${this.offset_}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${this.token_}` },
      },
    );

    const data = await res.json();

    data.items.forEach((_playlist: any) => {
      this.playlists.push({
        id: _playlist.id,
        name: _playlist.name,
        owner: _playlist.owner.display_name,
        images: _playlist.images,
      });
    });

    if (data.next === null || data.next === undefined || data.next === null)
      return false;
    else return true;
  }
}

export default Spotify;
