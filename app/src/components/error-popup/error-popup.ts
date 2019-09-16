import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'error-popup',
  templateUrl: './error-popup.html',
  styleUrls: ['./error-popup.scss']
})
export class ErrorPopUpComponent {
  constructor(private dialogRef:MatDialogRef<ErrorPopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {message:string}) {
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
