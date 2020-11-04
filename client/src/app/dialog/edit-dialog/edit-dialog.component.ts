import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import { MatChipService } from 'src/app/services/mat-chip.service';
import { VideoService } from 'src/app/services/video.service';


@Component({
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
  providers: [MatChipService]
})
export class EditDialogComponent implements OnInit {


  videoUrlForm:FormControl;
  keyWordsForm: FormControl; 
  videoNameForm:FormControl;

 dialogForm:FormGroup;
 public data: UserVideos;
  
get formControls(){return this.dialogForm.controls ;}
readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,public matChipService: MatChipService,private videoService:VideoService,
    @Inject(MAT_DIALOG_DATA) public _data: UserVideos,private fb:FormBuilder) {this.data=_data }

  ngOnInit(): void {

    const keyWordsNames=this.data.keyWords.map(k=>k.name);

   // this.videoUrlForm=new FormControl(this.data.videoUrl, [Validators.required]);
    this.keyWordsForm=new FormControl([...keyWordsNames], [Validators.required]);
this.videoNameForm=new FormControl(this.data.videoName, [Validators.required]);

    this.dialogForm=this.fb.group({
    //  videoUrl: this.videoUrlForm,
      keyWords:this.keyWordsForm,
      videoName:this.videoNameForm
    });
  
       this.videoUrlForm.valueChanges.subscribe(e=>{
         console.log(e);
       })
        this.keyWordsForm.valueChanges.subscribe(e=>{
        console.log(e);
      })
      this.videoNameForm.valueChanges.subscribe(e=>{
        console.log(e);
      })
  }
  getErrorMessage() {

    return this.videoUrlForm.hasError('required') ? 'Required field' :
    //  this.videoUrlForm.hasError('videoName') ? 'Not a valid email' :
      this.videoUrlForm.hasError('videoUrl') ? 'Not a valid url' :
        '';
  }
  submit(){

  }
  onNoClick(){
    
  }
  updateVideo(){
    const data =
    this.videoService.createUserVideosObject(this.data.videoId,this.data.videoUrl.toString(),this.formControls.videoName.value,this.matChipService.data);

    this.videoService.editVideo(data);
    this.dialogRef.close();
  }
}
