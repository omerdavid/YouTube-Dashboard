import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})

export class AddDialogComponent implements OnInit {

  videoUrlForm=new FormControl('', [Validators.required]);
 // keyWordsForm=new FormControl([], [Validators.required]); 
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
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserVideos,private fb:FormBuilder
            ) { }
  ngOnInit(): void {
     
  this.dialogForm=this.fb.group({
    videoUrl: this.videoUrlForm,

  });

     this.videoUrlForm.valueChanges.subscribe(e=>{
       console.log(e);
     })
  }
  
 
 
  // formControl = new FormControl('', [
  //   Validators.required
  //   // Validators.email,
  // ]);
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.vegetables.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.vegetables.indexOf(fruit);

    if (index >= 0) {
      this.vegetables.splice(index, 1);
    }
  }
  getErrorMessage() {
    
    return this.videoUrlForm.hasError('required') ? 'Required field' :
      this.videoUrlForm.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
   
  }
 

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.vegetables, event.previousIndex, event.currentIndex);
  }
}
