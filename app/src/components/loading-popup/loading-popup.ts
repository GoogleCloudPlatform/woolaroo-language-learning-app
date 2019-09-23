import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'loading-popup',
  templateUrl: './loading-popup.html',
  styleUrls: ['./loading-popup.scss']
})
export class LoadingPopUpComponent {
  constructor(private dialogRef:MatDialogRef<LoadingPopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {message:string}) {
  }
}
