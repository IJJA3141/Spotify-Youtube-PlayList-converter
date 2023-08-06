import { IpcRendererEvent } from "electron";

import { playlist } from "../types";

class HTMLPlaylistElement {
  private div_: HTMLDivElement;
  private index_: number;
  private image_!: HTMLImageElement;
  private name_: HTMLParagraphElement;
  private owner_: HTMLParagraphElement;

  constructor(_index: number, _playlist: playlist, _parent: HTMLElement) {
    this.div_ = document.createElement("div");
    this.div_.id = 'pDiv'

    console.log(_playlist.images);
    if (_playlist.images.length != 0) {
      this.image_ = document.createElement("img");
      this.image_.src = _playlist.images[0].url;
      this.image_.id = 'pImage'
      this.div_.appendChild(this.image_);
    }

    this.name_ = document.createElement("p");
    this.name_.innerText = _playlist.name;
    this.name_.id = 'pName'
    this.div_.appendChild(this.name_);

    this.owner_ = document.createElement("p");
    this.owner_.innerText = _playlist.owner;
    this.owner_.id = 'pOwner'
    this.div_.appendChild(this.owner_);

    this.index_ = _index;

    _parent.appendChild(this.div_);
  }
}

const root: HTMLBodyElement = document.getElementById(
  "root",
) as HTMLBodyElement;

let playlistElement: HTMLPlaylistElement[] = [];

//@ts-ignore
window.api.PlaylistsSendEvent(
  (_event: IpcRendererEvent, _playlists: playlist[]) => {
    _playlists.forEach((_playlist: playlist, _index: number) => {
      console.log(_playlist.name);
      playlistElement.push(new HTMLPlaylistElement(_index, _playlist, root));
    });
  },
);
