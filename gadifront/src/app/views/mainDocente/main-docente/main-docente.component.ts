import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { PersonaService } from '../../../Services/personaService/persona.service';
import { SrolService } from '../../../Services/rol/srol.service';
import { UsuarioRolService } from '../../../Services/UsuarioRol/usuario-rol.service';

@Component({
  selector: 'app-main-docente',
  templateUrl: './main-docente.component.html',
  styleUrl: './main-docente.component.css'
})
export class MainDocenteComponent {
  currentExplan: string = '';
  imagenActual: number = 0;
  imagenes: string[] = [
    'assets/img/fondopantalla.jpg',
    'assets/img/logo.png',
    'assets/img/escudo.png'
  ];

  rol: string = '';
  usuario: string = '';
  additionalPersonaData: any = {};
  titulos: any[] = [];
  rolNombre: string = '';
  contratoNombre: string = '';
  mensajeBienvenida: string = ''; 

  constructor(private authService: AuthService, private personaService: PersonaService, private usuarioRolService: UsuarioRolService, private rolService: SrolService) { }

  ngOnInit(): void {
    this.authService.explan$.subscribe(explan => {
      this.currentExplan = explan;
    });
    this.fetchUserDetails();
    this.cambiarImagen();
  }

  cambiarImagen(): void {
    setInterval(() => {
      this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
    }, 5000);
  }

  fetchUserDetails(): void {
    console.log('Fetching user details');
    const user = this.authService.getUser();
    console.log('User from localStorage:', user);

    const id_persona = user.id_persona;

    if (id_persona) {
      console.log('id_persona found:', id_persona);
      this.personaService.getPersonaById(id_persona).subscribe(
        (persona) => {
          console.log('Persona details fetched:', persona);
          const nombre = persona.nombre1 || '';
          const apellido = persona.apellido1 || '';
          this.usuario = user.username;
          this.additionalPersonaData = persona;
          this.getUsuarioRol(persona.id_persona);
          this.getTitulos(persona.id_persona);
          this.getTipoContrato(persona.id_tipo_contrato); 
          this.mensajeBienvenida = `Bienvenido ${nombre} ${apellido}`;
          console.log('Welcome message set to:', this.mensajeBienvenida);
          console.log('Persona data:', this.additionalPersonaData);
        },
        (error) => {
          console.error('Error fetching persona details:', error);
        }
      );
    } else {
      console.error('No id_persona found in user data');
    }
  }

  getUsuarioRol(id_persona: number): void {
    this.personaService.getUsuarioByPersonaId(id_persona).subscribe(
      (usuario) => {
        if (usuario) {
          this.usuarioRolService.getusuarioRolbyId(usuario.id_usuario).subscribe(
            (usuarioRol) => {
              this.rolService.getRolbyId(usuarioRol.id_rol).subscribe(
                (rol) => {
                  this.rol = rol.nombre_rol;
                  console.log('Rol fetched:', this.rol);
                },
                (error) => {
                  console.error('Error fetching rol details:', error);
                }
              );
            },
            (error) => {
              console.error('Error fetching user role:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching usuario by persona ID:', error);
      }
    );
  }

  getTitulos(id_persona: number): void {
    this.personaService.getTitulosProfecionalesByPersonaId(id_persona).subscribe(
      (titulos) => {
        this.titulos = titulos;
        console.log('Titulos fetched:', this.titulos);
      },
      (error) => {
        console.error('Error fetching titulos:', error);
      }
    );
  }

  getTipoContrato(id_contrato: number): void {
    this.personaService.getContratoById(id_contrato).subscribe(
      (contrato) => {
        this.additionalPersonaData.tipo_contrato = contrato.nombre_contrato;
        console.log('Tipo de contrato fetched:', this.additionalPersonaData.tipo_contrato);
      },
      (error) => {
        console.error('Error fetching tipo de contrato:', error);
      }
    );
  }
}