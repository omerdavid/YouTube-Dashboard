import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserVideos } from '../pages/tables/models/youTube-results';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
   
  public newVideoAdd$:Observable<UserVideos[]>;
  public newVideoAddSubject$:Subject<UserVideos[]>=new Subject<UserVideos[]>();

  constructor(public _http: HttpClient) { this.newVideoAdd$=this.newVideoAddSubject$.asObservable(); }

  errorHandler(error: HttpErrorResponse) {

    console.log(error.error);
    return throwError(error.message || "server error.");
  }

  addVideo(newVideo:UserVideos){
    const testVideoId = 'ILooaM258IA';

    this._http.post(`api/youTubeList/addVideo`, { videoId: newVideo.videoId,videoName:newVideo.videoName ,keyWords: newVideo.keyWords })
      .pipe(

        catchError(this.errorHandler)
      ).subscribe((d:UserVideos[])=>{
        this.newVideoAddSubject$.next(d);
      });
     
  }

}
