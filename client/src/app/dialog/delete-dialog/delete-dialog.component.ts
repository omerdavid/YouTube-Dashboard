import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import { MatChipService } from 'src/app/services/mat-chip.service';
import { VideoService } from 'src/app/services/video.service';


@Component({
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
  providers: [MatChipService]
})
export class DeleteDialogComponent  {


  
  public data: UserVideos;

 
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,private videoService: VideoService,
    @Inject(MAT_DIALOG_DATA) public _data: UserVideos) {

      this.data = _data; 
    
  }
 
  submit() {
   
    //go to server
    this.videoService.deleteVideo(this.data.videoId);
    this.dialogRef.close();
  
  }
  onNoClick(): void {
  
    this.dialogRef.close();
  }
 
}
