import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.html',
  styleUrls: ['./error-popup.scss']
})
export class ErrorPopUpComponent {
  constructor( private dialogRef: MatDialogRef<ErrorPopUpComponent>,
               @Inject(MAT_DIALOG_DATA) public data: {message: string, title?: string} ) {
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
