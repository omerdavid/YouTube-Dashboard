import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatChipService } from 'src/app/services/mat-chip.service';
import { BehaviorSubject, EmptyError, fromEvent, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  providers: [MatChipService]
})

export class AddDialogComponent implements OnInit {

  videoUrlForm = new FormControl('', [Validators.required]);
  keyWordsForm = new FormControl('', [Validators.required]);

  errMsg:string;
  dialogForm: FormGroup;

  get formControls() { return this.dialogForm.controls; }

  public onNewVideoAdded$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>, public matChipService: MatChipService, public _http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: UserVideos, private fb: FormBuilder
  ) { }
  ngOnInit(): void {

    this.dialogForm = this.fb.group({
      videoUrl: this.videoUrlForm,
      keyWords: this.keyWordsForm
    });

  }


  getErrorMessage() {

    return this.videoUrlForm.hasError('required') ? 'Required field' :
      this.videoUrlForm.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {

    const data = { videoUrl: this.dialogForm.controls.videoUrl.value, keyWords: this.matChipService.data };
    //go to server
    this.addVideo(data);


  }
  errorHandler(error: HttpErrorResponse) {
    console.log(error.error);
    setTimeout(() => {
      this.dialogRef.close();
     this.errMsg='server error . Details: ' + error;
    }, 2000)

    return throwError(error.message || "server error.");
  }
  addVideo(newVideo) {
const testVideoId='ILooaM258IA';
       
    this._http.post(`api/youTubeList/addVideo`, { videoId: testVideoId, keyWords: newVideo.keyWords })
      .pipe(

        catchError(this.errorHandler)
      )
      .subscribe(res => {

        this.dialogRef.close();
       // this.onNewVideoAdded$.next(res);

        console.log(res);
      })
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
