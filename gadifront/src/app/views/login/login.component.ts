import { Component } from '@angular/core';
import { LoginService } from '../../Services/loginService/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../../Services/loginService/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { RolService } from '../rol/rol.service';
import { Rol } from '../rol/rol';
import { SrolService } from '../../Services/rol/srol.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  public searchForm: FormGroup;
  constructor(private authService: AuthService, public loginService: LoginService, private fb: FormBuilder, private router: Router, private rolService: SrolService) {
    this.searchForm = this.fb.group({
      usuario: [''],
      contraneusu: ['']
    });
  }

  onSubmit() {

    const usuariol = this.searchForm.value.usuario;
    const contraneusu = this.searchForm.value.contraneusu;
    console.log(usuariol);

    this.loginService.getUsuario().subscribe(
      (result) => {
        if (Array.isArray(result) && result.length > 0) {
          const usuarioEncontrados = result as Usuario[];
          const usuarioEncontrado = usuarioEncontrados.find(usuario => usuario.contrasena === contraneusu && usuario.usuario === usuariol);
          if (usuarioEncontrado) {
            
            Swal.fire(`Bienvenid@ ${usuariol}`, 'Inicio de sesion correcto', 'success');
            this.authService.login();
            this.router.navigate(['./main']);

          } else {
            console.log('usuario no encontrado')

          }
        }

      }, (error) => {
        console.log(usuariol)
      });

  }
  roles: Rol[] = [];
  selectedRole: string | undefined;
  cargarRol(): void {
    this.rolService.getRol().subscribe(data => {
      this.roles  = data;
      this.showDialog();
      console.log(this.roles)
    });
  }


  showDialog() {
    Swal.fire({
      
      title: 'Selecciona un rol',
      html: `<select id="roleSelect" class="swal2-input">
               ${this.roles.map(role => `<option value="${role}">${role.nombre_rol}</option>`).join('')}
             </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const roleSelect = (Swal.getPopup()!.querySelector('#roleSelect') as HTMLSelectElement).value;
        if (!roleSelect) {
          Swal.showValidationMessage('Por favor selecciona un rol');
        }
        return roleSelect;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.selectedRole = result.value;
        console.log('Rol seleccionado:', this.selectedRole);
      }
    });
  }

}