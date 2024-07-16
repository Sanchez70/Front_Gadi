import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Asignatura } from '../../Services/asignaturaService/asignatura';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { forkJoin, map, Subscription } from 'rxjs';
import { AsignaturaService } from '../../Services/asignaturaService/asignatura.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { CicloService } from '../../Services/cicloService/ciclo.service';
import { AsignaturaModalComponent } from '../crud-asignatura/asignatura-model.component';
import Swal from 'sweetalert2';
import { Usuario } from '../../Services/loginService/usuario';
import { LoginService } from '../../Services/loginService/login.service';
import { CarreraService } from '../../Services/carreraService/carrera.service';
import { UsuarioRolService } from '../../Services/UsuarioRol/usuario-rol.service';
import { RolService } from '../rol/rol.service';
import { PersonaService } from '../../Services/personaService/persona.service';
import { UsuarioRol } from '../../Services/UsuarioRol/usuarioRol';
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  showCloseButton: true,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
@Component({
  selector: 'app-eliminar-rol',
  templateUrl: './eliminar-rol.component.html',
  styleUrl: './eliminar-rol.component.css'
})

export class EliminarRolComponent implements OnInit {

  displayedColumns: string[] = ['usuario', 'nombre_persona', 'carrera', 'rol', 'borrar'];
  dataSource!: MatTableDataSource<any>;
  color = '#1E90FF';
  currentExplan: string = '';
  usuario: Usuario = new Usuario();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private sidebarSubscription!: Subscription;

  constructor(private asignaturaService: AsignaturaService,
    private dialog: MatDialog,
    private authService: AuthService,
    private cicloService: CicloService,
    private usuarios: LoginService,
    private carrerra: CarreraService,
    private usuarioRol: UsuarioRolService,
    private roles: RolService,
    private persona: PersonaService


  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.sidebarSubscription = this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
      this.adjustTable();
    });
  }

  ngAfterViewInit(): void {
    this.adjustTable();
  }

  ngOnDestroy(): void {
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }

  loadRoles(): void {
    forkJoin({
      usuarios: this.usuarios.getUsuario(),
      roles: this.roles.getRoles(),
      usuarioRoles: this.usuarioRol.getusuarioRol(),
      personas: this.persona.getPersonas()
    }).pipe(
      map(({ usuarioRoles, roles, usuarios, personas }) => {
        const data: any[] = [];

        // Filtrar usuarios que tienen carrera no nula
        const usuariosFiltrados = usuarios.filter(usuario => usuario.carrera != null);

        usuariosFiltrados.forEach(usuario => {
          // Encontrar el rol del usuario
          const usuarioRolEncontrado = usuarioRoles.find(ur => ur.id_usuario === usuario.id_usuario && ur.id_rol === 2);

          if (usuarioRolEncontrado) {  // Solo procesar si se encontró el rol de Director
            const personaEncontrada = personas.find(persona => persona.id_persona === usuario.id_persona);

            const usuarioData = {
              id: usuario.id_usuario,
              usuario: usuario.usuario,
              nombres: personaEncontrada ? `${personaEncontrada.nombre1} ${personaEncontrada.apellido1}` : '',
              carrera: usuario.carrera?.nombre_carrera,
              rol: 'Director'
            };

            data.push(usuarioData);
          }
        });

        return data;
      })
    ).subscribe(data => {
      this.dataSource.data = data;
    });
  }





  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  deleteAsignatura(id: number): void {
    this.usuario = new Usuario();
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarios.getUsuariobyId(id).subscribe(resultado => {
          this.usuario = resultado;
          this.usuario.carrera = undefined;
          this.usuarios.updateUsuario(this.usuario).subscribe(response => {
            this.usuarioRol.getusuarioRol().subscribe(usuarioRol => {
              const usuariosRoles = usuarioRol as UsuarioRol[];
              const usuarioRolesFiltrados = usuariosRoles.filter(rol => rol.id_usuario === response.id_usuario);
              const resultadoFinal = usuarioRolesFiltrados.find(rol => rol.id_rol === 2);
              if (resultadoFinal) {
                this.usuarioRol.deleteid(resultadoFinal.id_usuario_rol).subscribe(respuesta => {
                  Toast.fire({
                    icon: "success",
                    title: "Director eliminado correctamente",
                  });
                });
              }
            });
          });
        });
      }
    });
  }
  adjustTable(): void {
    if (this.dataSource && this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      window.dispatchEvent(new Event('resize'));
    }
  }
}
