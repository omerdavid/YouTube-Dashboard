import { SafeResourceUrl } from '@angular/platform-browser';

export class UserVideos{
    videoId:string;
    videoUrl:string|SafeResourceUrl;
    keyWords:KeyWord[]
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

        