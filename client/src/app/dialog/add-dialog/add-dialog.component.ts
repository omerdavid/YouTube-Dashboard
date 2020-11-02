import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import { MatChipService } from 'src/app/services/mat-chip.service';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  providers: [MatChipService]
})

export class AddDialogComponent implements OnInit {

  videoUrlForm = new FormControl('', [Validators.required, this.isValidYoutubeUrl]);
  keyWordsForm = new FormControl('', [Validators.required]);
  videoName=new FormControl('', [Validators.required]);

  errMsg: string;
  dialogForm: FormGroup;

  get formControls() { return this.dialogForm.controls; }

  public onNewVideoAdded$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, public matChipService: MatChipService,private videoService:VideoService,
    @Inject(MAT_DIALOG_DATA) public data: UserVideos, private fb: FormBuilder
  ) { }
  ngOnInit(): void {

    this.dialogForm = this.fb.group({
      videoUrl: this.videoUrlForm,
      keyWords: this.keyWordsForm,
      videoName:this.videoName
    },
    {
      validator: (formGroup: FormGroup) => {
        return this.validateGroup(formGroup);
      }
  }
    );
    
  }
  private validateGroup(formGroup: FormGroup) {

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (control.value) {
          return null;
        }
      }
    }
    return {
      validateGroup: {
        valid: false
      }
    };
  }
  isValidYoutubeUrl(control: AbstractControl): ValidationErrors | null {
    if (!control.value)
      return;
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = control.value.match(regExp);

    // console.log(match[7]);
    return (match && match[7].length == 11) ? null : { videoUrl: 'is not valid' };


  }

  // youtube_parser(url: string) {
  //   if (!url)
  //     return;
  //   var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  //   var match = url.match(regExp);
  //   return (match && match[7].length == 11) ? match[7] : false;
  // }

  getVideoIdFromUrl(url): string {

    let _url = new URL('', url);
    if (_url.searchParams.has('v')) {

      const videoId = _url.searchParams.get('v');
      return videoId;
    }
  }

  getErrorMessage() {

    return this.videoUrlForm.hasError('required') ? 'Required field' :
    //  this.videoUrlForm.hasError('videoName') ? 'Not a valid email' :
      this.videoUrlForm.hasError('videoUrl') ? 'Not a valid url' :
        '';
  }

  submit() {
  
    const _videoId=this.getVideoIdFromUrl(this.dialogForm.controls.videoUrl.value);
    const data = { videoId:_videoId ,videoName:this.formControls.videoName.value, keyWords: this.matChipService.data };
    console.log('is Form valid :',!!this.videoUrlForm.valid)
    if(!!this.videoUrlForm.valid){
    //go to server
     this.addVideo(data);
    }


  }
  errorHandler(error: HttpErrorResponse) {

    console.log(error.error);
    setTimeout(() => {
      this.dialogRef.close();
      this.errMsg = 'server error . Details: ' + error;
    }, 2000)

    return throwError(error.message || "server error.");
  }
  addVideo(newVideo) {
    const x= { videoId: newVideo.videoId,videoName:newVideo.videoName ,keyWords: newVideo.keyWords };
    this.videoService.addVideo(newVideo);
    this.dialogRef.close();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.submit();

  }


  // drop(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.vegetables, event.previousIndex, event.currentIndex);
  // }
}
