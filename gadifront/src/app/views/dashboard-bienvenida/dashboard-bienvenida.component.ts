import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { PersonaService } from '../../Services/personaService/persona.service';
import { SrolService } from '../../Services/rol/srol.service';
import { UsuarioRolService } from '../../Services/UsuarioRol/usuario-rol.service';

@Component({
  selector: 'app-dashboard-bienvenida',
  templateUrl: './dashboard-bienvenida.component.html',
  styleUrl: './dashboard-bienvenida.component.css'
})
export class DashboardBienvenidaComponent implements OnInit{
  imagenActual: number = 0;
  currentExplan: string = '';
  images: any[] = [
    {
      itemImageSrc: 'assets/img/fondopantalla.jpg',
      thumbnailImageSrc: 'assets/img/fondopantalla.jpg'
    },
    {
      itemImageSrc: 'assets/img/fondopantalla.jpg',
      thumbnailImageSrc: 'assets/img/fondopantalla.jpg'
    },
    {
      itemImageSrc: 'assets/img/fondopantalla.jpg',
      thumbnailImageSrc: 'assets/img/fondopantalla.jpg'
    },
    // más imágenes
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
    // this.cambiarImagen();
  }

  responsiveOptions: any[] = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

  fetchUserDetails(): void {
    
    const user = this.authService.getUser();
    

    const id_persona = user.id_persona;

    if (id_persona) {
      
      this.personaService.getPersonaById(id_persona).subscribe(
        (persona) => {
          
          const nombre = persona.nombre1 || '';
          const apellido = persona.apellido1 || '';
          this.usuario = user.username;
          this.additionalPersonaData = persona;
          this.getUsuarioRol(persona.id_persona);
          this.getTitulos(persona.id_persona);
          this.getTipoContrato(persona.id_tipo_contrato); 
          this.mensajeBienvenida = `Bienvenido ${nombre} ${apellido}`;
          
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
        
      },
      (error) => {
        console.error('Error fetching tipo de contrato:', error);
      }
    );
  }
}
