import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormpreviewComponent } from './formpreview/formpreview.component';


interface FieldConfig {
  type: string;
  label: string;
  name: string;
  options?: any[];
  validations?: any[];
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  fieldTypes = ['Text', 'Email', 'Number', 'Password', 'Dropdown', 'Checkbox', 'Radio'];
  formFields: FieldConfig[] = [];
  selectedFieldType: string = '';
  newFieldLabel: string = '';
  newFieldName: string = '';
  newOptions: string[] = [];
  generatedFormCode = '';
  componentName = 'DynamicFormComponent';
  formName = 'dynamicForm';

  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  addField() {
    if (!this.selectedFieldType || !this.newFieldLabel || !this.newFieldName) {
      alert('Please enter field details');
      return;
    }

    const newField: FieldConfig = {
      type: this.selectedFieldType,
      label: this.newFieldLabel,
      name: this.newFieldName,
      options: this.selectedFieldType === 'Dropdown' || this.selectedFieldType === 'Radio' || this.selectedFieldType === 'Checkbox' ? [...this.newOptions] : undefined,
      validations: [],
    };

    this.formFields.push(newField);

    // Reset fields
    this.selectedFieldType = '';
    this.newFieldLabel = '';
    this.newFieldName = '';
    this.newOptions = [];
  }


  copyToClipboard() {
    navigator.clipboard.writeText(this.generatedFormCode).then(() => {
      alert('Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
  

  addOption(optionValue: string) {
    if (optionValue) {
      this.newOptions.push(optionValue);
    }
  }

  removeOption(index: number) {
    this.newOptions.splice(index, 1);
  }

  generateForm() {
    let formControls = '';
    let formHtml = '';

    this.formFields.forEach((field) => {
      formControls += `  ${field.name}: new FormControl('', [${field.validations?.join(', ')}]),\n`;

      if (['Text', 'Email', 'Number', 'Password'].includes(field.type)) {
        formHtml += `<mat-form-field><mat-label>${field.label}</mat-label>\n<input matInput type="${field.type.toLowerCase()}" formControlName="${field.name}"/>\n</mat-form-field>\n`;
      } else if (field.type === 'Dropdown') {
        formHtml += `<mat-form-field><mat-label>${field.label}</mat-label>\n<mat-select formControlName="${field.name}">\n`;
        field.options?.forEach((opt) => {
          formHtml += `<mat-option value="${opt}">${opt}</mat-option>\n`;
        });
        formHtml += `</mat-select></mat-form-field>\n`;
      } else if (field.type === 'Checkbox') {
        field.options?.forEach((opt) => {
          formHtml += `<mat-checkbox formControlName="${field.name}">${opt}</mat-checkbox>\n`;
        });
      } else if (field.type === 'Radio') {
        field.options?.forEach((opt) => {
          formHtml += `<mat-radio-group formControlName="${field.name}"><mat-radio-button value="${opt}">${opt}</mat-radio-button></mat-radio-group>\n`;
        });
      }
    });

    this.generatedFormCode = `
  import { Component } from '@angular/core';
  import { FormGroup, FormControl, Validators } from '@angular/forms';

  @Component({
    selector: 'app-${this.componentName.toLowerCase()}',
    templateUrl: './${this.componentName.toLowerCase()}.component.html',
    styleUrls: ['./${this.componentName.toLowerCase()}.component.css'],
  })
  export class ${this.componentName} {
    ${this.formName} = new FormGroup({
${formControls}    });

    onSubmit() {
      console.log(this.${this.formName}.value);
    }
  }
  
  // HTML Code:
  <form [formGroup]="${this.formName}" (ngSubmit)="onSubmit()">
${formHtml}
    <button mat-raised-button color="primary" type="submit">Submit</button>
  </form>
    `;
  }

  previewForm() {
    this.dialog.open(FormpreviewComponent, {
      width: '50%',
      data: { fields: this.formFields }
    });
  }
}
