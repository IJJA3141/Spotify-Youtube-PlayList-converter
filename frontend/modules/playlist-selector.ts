import SideBar from "./side-bar.js";
import ImageDisplay from "./image-display.js";
import { playlist } from "../../backend/src/types.js";

class PlaylistSelector {
  private element_: HTMLDivElement;
  private playlists_: playlist[];

  // top part
  private topElement_: HTMLDivElement;
  private topSideBar_: SideBar;
  private topBar_: HTMLDivElement;
  private topText_: HTMLParagraphElement;

  // bottom part
  private bottomElement_: HTMLDivElement;
  private bottomSideBar_: SideBar;
  private image_: ImageDisplay;

  public constructor(_parent: HTMLElement, _playlists: playlist[]) {
    this.element_ = document.createElement("div");
    this.element_.id = "playlist-selector";
    this.playlists_ = _playlists;

    this.topElement_ = document.createElement("div");
    this.topSideBar_ = new SideBar(
      this.topElement_,
      "playlist-selector-side-bar-top",
    );
    this.topBar_ = document.createElement("div");
    this.topText_ = document.createElement("p");
    this.topText_.innerText = "Playlist Selector";
    this.topBar_.appendChild(this.topText_);
    this.topElement_.appendChild(this.topBar_);

    this.bottomElement_ = document.createElement("div");
    this.topSideBar_ = new SideBar(
      this.bottomElement_,
      "playlist-selector-side-bar-bottom",
    );
    this.image_ = new ImageDisplay(
      this.bottomElement_,
      "playlist-selector-image-display",
    );

    this.element_.appendChild(this.topElement_);
    this.element_.appendChild(this.bottomElement_);
    _parent.appendChild(this.element_);

    this.image_.update(this.playlists_[0]);

    return;
  }
}

export default PlaylistSelector;
