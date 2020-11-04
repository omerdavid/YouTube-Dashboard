import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeyWord, UserVideos } from '../pages/tables/models/youTube-results';

@Injectable({
  providedIn: 'root'
})
export class VideoService implements OnDestroy {

  public newVideoAdd$: Observable<UserVideos[]>;
  private newVideoAddSubject$: Subject<UserVideos[]> = new Subject<UserVideos[]>();


  private editVideoSubject$: Subject<UserVideos[]> = new Subject<UserVideos[]>();
  public editVideo$: Observable<UserVideos[]> = this.editVideoSubject$.asObservable();
  sub: Subscription;
  constructor(public _http: HttpClient) { this.newVideoAdd$ = this.newVideoAddSubject$.asObservable(); }
  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }

  errorHandler(error: HttpErrorResponse) {

    console.log(error.error);
    return throwError(error.message || "server error.");
  }
  editVideo(item: UserVideos) {
    
    this.sub = this._http.post(`api/youTubeList/editVideo`, { videoId: item.videoId, videoName: item.videoName, keyWords: item.keyWords })
      .pipe(

        catchError(this.errorHandler)
      ).subscribe((d: UserVideos[]) => {
        this.editVideoSubject$.next(d);
      });
  }
  addVideo(newVideo: UserVideos) {
    const testVideoId = 'ILooaM258IA';

    this._http.post(`api/youTubeList/addVideo`, { videoId: newVideo.videoId, videoName: newVideo.videoName, keyWords: newVideo.keyWords })
      .pipe(

        catchError(this.errorHandler)
      ).subscribe((d: UserVideos[]) => {
        this.newVideoAddSubject$.next(d);
      });

  }
  createUserVideosObject(videoId:string,videoUrl:string,videoName:string,keyWords:KeyWord[],title:string=null,description=null):UserVideos{
     let obj=new UserVideos();
     obj.videoUrl=videoUrl;
     obj.videoName=videoName;
     obj.videoId=videoId;
     obj.keyWords=keyWords;
     obj.title=title;
     obj.description=description;
     return obj;

  }
}
