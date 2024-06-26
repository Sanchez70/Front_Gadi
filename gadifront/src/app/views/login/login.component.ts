import { Component } from '@angular/core';
import { LoginService } from '../../Services/loginService/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../Services/loginService/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth.service';
import { SrolService } from '../../Services/rol/srol.service';
import { UsuarioRolService } from '../../Services/UsuarioRol/usuario-rol.service';
import { Rol } from '../../Services/rol/rol';
import { UsuarioRol } from '../../Services/UsuarioRol/usuarioRol';
import * as bcrypt from 'bcryptjs';
import { RolSelectorComponent } from './rol-selector.component';
import { MatDialog } from '@angular/material/dialog';

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  usuarioRoles: UsuarioRol[] = [];
  roles: Rol[] = [];
  public searchForm: FormGroup;
  isLoading = false;
  constructor(private authService: AuthService, public loginService: LoginService, private fb: FormBuilder, private router: Router, private rolService: SrolService, private usuarioRol: UsuarioRolService,  public dialog: MatDialog) {
    this.searchForm = this.fb.group({
      usuario: ['', Validators.required],
      contraneusu: ['', Validators.required]
    });
  }

  onSubmit() {
    this.isLoading = true; 
    this.validar();
  }


  validar(): void {
    const usuariol = this.searchForm.value.usuario;
    const contraneusu = this.searchForm.value.contraneusu;

    if (usuariol === '') {
      this.isLoading = false;
      Toast.fire({
        icon: "error",
        title: "Campo Usuario Vacio",
        footer: "Por favor, verifique si ha completado todo lo necesario"
      });
    } else if (contraneusu === '') {
      this.isLoading = false;
      Toast.fire({
        icon: "error",
        title: "Campo Contraseña Vacio",
        footer: "Por favor, verifique si ha completado todo lo necesario"
      });
    } else {
      this.loginService.getUsuario().subscribe(
        (result) => {
          if (Array.isArray(result) && result.length > 0) {
            const usuarioEncontrados = result as Usuario[];
            const usuarioEncontrado = usuarioEncontrados.find(usuario => usuario.usuario === usuariol);
            if (usuarioEncontrado) {
              // Encriptar la contraseña ingresada por el usuario
              bcrypt.compare(contraneusu, usuarioEncontrado.contrasena, (err: any, res: any) => {
                this.isLoading = false;
                if (err) {
                  console.error('Error al comparar contraseñas:', err);
                  return;
                }
                if (res) {
                  this.authService.setIdPersona(usuarioEncontrado.id_persona); // Guardar el id_persona
                  this.cargarRol(usuarioEncontrado.id_usuario, usuariol);
                  this.authService.id_carrera = usuarioEncontrado.carrera?.id_carrera;
                } else {
                  Swal.fire('Usuario o contraseña incorrecta', 'Intente nuevamente', 'error');
                }
              });
            } else {
              this.isLoading = false;
              Swal.fire('Usuario no encontrado', 'Intente nuevamente', 'error');
            }
          }
        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Error al obtener los datos del usuario', 'Intente nuevamente', 'error');
        }
      );
    }
  }

  // validar(): void {
  //   const usuariol = this.searchForm.value.usuario;
  //   const contraneusu = this.searchForm.value.contraneusu;

  //   if (usuariol === '') {
  //     Toast.fire({
  //       icon: "error",
  //       title: "Campo Usuario Vacio",
  //       footer: "Por favor, verifique si ha completado todo lo necesario"
  //     });

  //   } else if (contraneusu === '') {
  //     Toast.fire({
  //       icon: "error",
  //       title: "Campo Contraseña Vacio",
  //       footer: "Por favor, verifique si ha completado todo lo necesario"
  //     });

  //   } else {
  //     this.loginService.getUsuario().subscribe(
  //       (result) => {
  //         if (Array.isArray(result) && result.length > 0) {
  //           const usuarioEncontrados = result as Usuario[];
  //           const usuarioEncontrado = usuarioEncontrados.find(usuario => usuario.contrasena === contraneusu && usuario.usuario === usuariol);
  //           console.log('Usuario encontrado:', usuarioEncontrado);
  //           console.log('ID de carrera del usuario encontrado:', usuarioEncontrado?.carrera?.id_carrera);
  //           if (usuarioEncontrado) {
  //             this.cargarRol(usuarioEncontrado.id_usuario, usuariol);
  //             this.authService.id_carrera = usuarioEncontrado.carrera?.id_carrera;
  //             console.log(this.authService.id_carrera)

  //           } else {
  //             Swal.fire('Usuario o contraseña erronea', 'Intente nuevamente', 'error');

  //           }
  //         }

  //       }, (error) => {
  //         Swal.fire('Campos Vacios', 'Intente nuevamente', 'error');
  //       });
  //   }
  // }

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

          }
        }
      });
  }


  showDialog(usuario: any) {
    const dialogRef = this.dialog.open(RolSelectorComponent, {
      width: '300px',
      data: { roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRole = result;
        this.tipoRol(result);
        Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');
      }
    });
  }

  tipoRol(rolNombre: any): void {
    if (rolNombre == 'Director') {
      this.authService.tiporol = rolNombre;
      this.router.navigate(['/main']);
      this.authService.login();
    } else {
      if (rolNombre == 'Coordinador') {
        this.authService.tiporol = rolNombre;
        this.router.navigate(['/mainCoordinador']);
        this.authService.login();
      } else {
        if (rolNombre == 'Docente') {
          this.authService.tiporol = rolNombre;
          this.router.navigate(['/mainDocente']);
          this.authService.login();
        } else {
          if (rolNombre == 'Administrador') {
            this.authService.tiporol = rolNombre;
            this.router.navigate(['/main-admin']);
            this.authService.login();
          }
        }
      }
    }
  }
}