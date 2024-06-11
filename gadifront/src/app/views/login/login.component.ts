import { Component } from '@angular/core';
import { LoginService } from '../../Services/loginService/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Usuario } from '../../Services/loginService/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { SrolService } from '../../Services/rol/srol.service';
import { UsuarioRolService } from '../../Services/UsuarioRol/usuario-rol.service';
import { Rol } from '../../Services/rol/rol';
import { UsuarioRol } from '../../Services/UsuarioRol/usuarioRol';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  usuarioRoles: UsuarioRol[] = [];
  roles: Rol[] = [];
  public searchForm: FormGroup;
  constructor(private authService: AuthService, public loginService: LoginService, private fb: FormBuilder, private router: Router, private rolService: SrolService, private usuarioRol: UsuarioRolService) {
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
            this.cargarRol(usuarioEncontrado.id_usuario, usuariol);
            
              
          } else {
            console.log('usuario no encontrado')

          }
        }

      }, (error) => {
        console.log(usuariol)
      });

  }

  selectedRole: string | undefined;
  cargarRol(id_rol: any, usuario: any): void {
    this.usuarioRol.getusuarioRol().subscribe(
      (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const rolEncontrados = data as UsuarioRol[];
          const usuarioEncontrado = rolEncontrados.filter(rol => rol.id_usuario === id_rol);
          if (usuarioEncontrado.length > 0) {
            this.rolService.getRol().subscribe(rol => {
              this.roles = rol.filter(rol => usuarioEncontrado.some(usuarioRol => usuarioRol.id_rol === rol.id_rol));
              if (this.roles.length > 0) {
                this.showDialog(usuario);

              }
            });

          } else {
            Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');
            this.router.navigate(['./main']);
            this.authService.login();
          }
        }
      });
  }


  showDialog(usuario:any) {
    Swal.fire({
      title: 'Selecciona un rol',
      html: `<select id="roleSelect" class="swal2-input">
               ${this.roles.map(role => `<option value="${role.nombre_rol}">${role.nombre_rol}</option>`).join('')}
             </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const roleSelect = (Swal.getPopup()!.querySelector('#roleSelect') as HTMLSelectElement).value;
        Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');
        this.router.navigate(['./main']);
        this.authService.login();
        console.log(roleSelect);
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