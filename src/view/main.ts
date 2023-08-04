import { IpcRendererEvent } from "electron";

const root: HTMLBodyElement = document.getElementById(
  "root",
) as HTMLBodyElement;

console.log("Hi from renderer");

//@ts-ignore
window.api.spotify((_event: IpcRendererEvent, _url: string) => {
  console.log(`${_event}\n\n${_url}`);
  console.log("event");
  const iframe: HTMLIFrameElement = document.createElement("iframe");
  iframe.src = _url;
  root.appendChild(iframe);
});
