import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatChipService } from 'src/app/services/mat-chip.service';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss'],
  providers:[MatChipService]
})

export class AddDialogComponent implements OnInit {

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

  public onSubmit$:BehaviorSubject<any>=new BehaviorSubject<any>(null);

  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,public matChipService:MatChipService,
              @Inject(MAT_DIALOG_DATA) public data: UserVideos,private fb:FormBuilder
            ) { }
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
  
  
  getErrorMessage() {
    
    return this.videoUrlForm.hasError('required') ? 'Required field' :
      this.videoUrlForm.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    console.log(this.matChipService.data);
    const data={videoUrl:this.dialogForm.controls.videoUrl.value,keyWords:this.matChipService.data};
    this.onSubmit$.next(data);
    //go to server

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.submit();
    
  }
 

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.vegetables, event.previousIndex, event.currentIndex);
  }
}
