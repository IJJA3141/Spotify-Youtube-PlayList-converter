class SideBar {
  private element_: HTMLDivElement;
  private bar_: HTMLDivElement;
  private left_: HTMLDivElement;
  private right_: HTMLDivElement;

  public constructor(_parent: HTMLElement, _id?: string) {
    this.element_ = document.createElement("div");
    this.bar_ = document.createElement("div");
    this.right_ = document.createElement("div");
    this.left_ = document.createElement("div");

    this.element_.className = "side-bar";
    this.bar_.className = "side-bar";
    this.left_.className = "side-bar";
    this.right_.className = "side-bar";

    if (_id) {
      this.element_.id = _id;
      this.bar_.id = _id;
      this.right_.id = _id;
      this.left_.id = _id;
    }

    this.element_.appendChild(this.bar_);
    this.element_.appendChild(this.left_);
    this.element_.appendChild(this.right_);

    _parent.appendChild(this.element_);
  }
}

export default SideBar;
