import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';


@Component({
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {


  videoUrlForm=new FormControl('', [Validators.required]);
  keyWordsForm=new FormControl('', [Validators.required]); 


 dialogForm:FormGroup;
   vegetables= [
    {name: 'apple'},
    {name: 'banana'},
    {name: 'strawberry'},
    {name: 'orange'},
    {name: 'kiwi'},
    {name: 'cherry'},
  ];
get formControls(){return this.dialogForm.controls ;}
readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserVideos,private fb:FormBuilder) { }

  ngOnInit(): void {

    this.dialogForm=this.fb.group({
      videoUrl: this.videoUrlForm,
      keyWords:this.keyWordsForm
    });
  
       this.videoUrlForm.valueChanges.subscribe(e=>{
         console.log(e);
       })
        this.keyWordsForm.valueChanges.subscribe(e=>{
        console.log(e);
      })
  }

}
