import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';

import {FormControl, Validators} from '@angular/forms';
import { UserVideos } from 'src/app/pages/tables/models/youTube-results';


@Component({
  selector: 'app-add.dialog',
  templateUrl: 'add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})

export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserVideos,
            ) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
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
}
