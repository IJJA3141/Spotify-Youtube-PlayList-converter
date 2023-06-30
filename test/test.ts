import {song, song_list} from '../src/fs.js'

const a:song_list = new song_list();

(async ()=>{
  await a.init();
  a.test();
  console.log(`result: ${a.array_song[1].completed}`);
  a.save()
})()
