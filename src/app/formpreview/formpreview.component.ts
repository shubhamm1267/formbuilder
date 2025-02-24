import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-formpreview',
  templateUrl: './formpreview.component.html',
  styleUrls: ['./formpreview.component.css']
})
export class FormpreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<FormpreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  submitPreviewForm() {
    console.log(this.data.fields,"Preview form submitted!");
    this.dialogRef.close();
  }


}