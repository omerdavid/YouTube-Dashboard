import { SafeResourceUrl } from '@angular/platform-browser';

export class YouTubeSearchResults{
    videoId:string;
    keyWords:KeyWord[]
    videoUrl:string|SafeResourceUrl;
    title:string;
    channelTitle:string;
    description:string;
  
}
export class KeyWord{
    name:string
  data:KeyWordData[]
    
}
export class KeyWordData{
    dateChecked:Date;
    rank:number;
}

        