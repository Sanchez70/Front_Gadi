import { Component } from '@angular/core';
import { LoginService } from '../../Services/loginService/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../../Services/loginService/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public searchForm: FormGroup; 
  constructor(private authService: AuthService,public loginService: LoginService,  private fb: FormBuilder, private router: Router) { this.searchForm = this.fb.group({
    usuario: [''],
    contraneusu: ['']
  });}

  onSubmit(){
    const usuariol=this.searchForm.value.usuario;
    const contraneusu=this.searchForm.value.contraneusu;
    console.log(usuariol);

    this.loginService.getUsuario().subscribe(
      (result) => {
      if (Array.isArray(result) && result.length > 0) {
        const usuarioEncontrados = result as Usuario[];
        const usuarioEncontrado = usuarioEncontrados.find(usuario => usuario.contrasena === contraneusu && usuario.usuario===usuariol);
        if (usuarioEncontrado) {
          Swal.fire(`Bienvenid@ ${usuariol}`, 'Inicio de sesion correcto', 'success');
          this.authService.login();
          this.router.navigate(['./main']);
      
        } else {
          console.log('usuario no encontrado')
        
        }
      }

    },(error) => {
      console.log(usuariol)
    });

  }

}