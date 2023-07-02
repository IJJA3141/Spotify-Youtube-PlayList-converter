interface external_urls{
  spotify:string,
}

interface ImageObject{
  url:string,
  height:number,
  width:number,
}

interface restrictions{
  reason:string,
}

interface CopyrightObject{
  text:string,
  type:string,
}

interface external_ids{
  isrc:string,
  ean:string,
  upc:string,
}

interface SimplifiedArtistObject{
  external_urls:external_urls,
  href:string,
  id:string,
  name:string,
  type:string,
  uri:string,
}

interface album{
  album_type:string,
  total_tracks:number,
  available_markets:Array<string>,
  external_urls:external_urls,
  href:string,
  id:string,
  images:Array<ImageObject>,
  name:string,
  release_date:string,
  release_date_precision:string,
  restrictions:restrictions,
  type:string,
  uri:string,
  copyrights:Array<CopyrightObject>,
  external_ids:external_ids,
  genres:Array<string>,
  label:string,
  popularity:number,
  album_group:string,
  artists:Array<SimplifiedArtistObject>,
}

interface followers{
  href:string | null | undefined,
  total:number,
}

interface artist{
  external_urls:external_urls,
  followers:followers,
  genres:Array<string>,
  href:string,
  id:string,
  images:Array<ImageObject>,
  name:string,
  popularity:number,
  type:string,
  uri:string,
}

interface linked_from{
  TrackRelinking:any,
}

interface TrackObject{
  album:album,
  artists:Array<artist>,
  available_markets:Array<string>,
  disc_number:number,
  duration_ms:number,
  explicit:boolean,
  external_ids:external_ids,
  external_urls:external_urls,
  href:string,
  id:string,
  is_playable:boolean,
  linked_from:linked_from,
  restrictions:restrictions,
  name:string,
  popularity:number,
  preview_url:string,
  track_number:number,
  type:string,
  uri:string,
  is_local:boolean,
}

export {TrackObject}
