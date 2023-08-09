import { playlist } from "../../backend/src/types.js";

class ImageDisplay {
  private element_: HTMLDivElement;
  private image_: HTMLImageElement;
  private owner_: HTMLParagraphElement;
  private ownerValue_: HTMLParagraphElement;
  private status_: HTMLParagraphElement;
  private statusValue_: HTMLParagraphElement;
  private description_: HTMLParagraphElement;
  private descriptionValue_: HTMLParagraphElement;

  public constructor(_parent: HTMLElement, _id?: string) {
    this.element_ = document.createElement("div");
    this.image_ = document.createElement("img");
    this.owner_ = document.createElement("p");
    this.ownerValue_ = document.createElement("p");
    this.status_ = document.createElement("p");
    this.statusValue_ = document.createElement("p");
    this.description_ = document.createElement("p");
    this.descriptionValue_ = document.createElement("p");

    this.element_.className = "image-display";
    this.image_.className = "image-display";
    this.owner_.className = "image-display";
    this.ownerValue_.className = "image-display";
    this.status_.className = "image-display";
    this.statusValue_.className = "image-display";
    this.description_.className = "image-display";
    this.descriptionValue_.className = "image-display";

    if (_id) {
      this.element_.id = _id;
      this.image_.id = _id;
      this.owner_.id = _id;
      this.ownerValue_.id = _id;
      this.status_.id = _id;
      this.statusValue_.id = _id;
      this.description_.id = _id;
      this.descriptionValue_.id = _id;
    }

    this.owner_.innerText = "owner:";
    this.status_.innerText = "sync:";
    this.description_.innerText = "description:";

    this.element_.appendChild(this.image_);
    this.element_.appendChild(this.owner_);
    this.element_.appendChild(this.ownerValue_);
    this.element_.appendChild(this.status_);
    this.element_.appendChild(this.statusValue_);
    this.element_.appendChild(this.description_);
    this.element_.appendChild(this.descriptionValue_);

    _parent.appendChild(this.element_);
  }

  public update(_playlist?: playlist): void {
    this.image_.src = _playlist.images[0].url;
    this.ownerValue_.innerText = _playlist.owner;
    //this.statusValue_.innerText = _playlist.sync;
    //this.descriptionValue_.innerText = _playlist.description;

    return;
  }
}

export default ImageDisplay;
