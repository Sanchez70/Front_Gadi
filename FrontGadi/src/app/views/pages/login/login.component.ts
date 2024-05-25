import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import {LoginService} from 'src/app/Services/loginService/login.service'
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {

  public searchForm: FormGroup; 
  constructor(public loginService: LoginService,  private fb: FormBuilder) { this.searchForm = this.fb.group({
    usuario: [''],
    contraneusu: ['']
  });}

  onSubmit(){
    const usuario=this.searchForm.value.usuario;
    const contraneusu=this.searchForm.value.contraneusu;
    console.log(usuario);
  }

}
