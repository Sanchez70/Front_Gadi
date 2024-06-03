import { Component } from "@angular/core";
import {FloatLabelType, MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, FormControl } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';


@Component({
    selector: 'app-registro',
    templateUrl: './registro1.component.html',
    styleUrl: './registro.component.css',
    standalone: true,
    imports: [
        FormsModule,
        MatRadioModule,
      ],
})

export class RegistroComponent{
    public registro1!: FormGroup; 
    public registro2!: FormGroup;

    floatLabelControl = new FormControl('auto' as FloatLabelType);

    onSubmit(){}
}

