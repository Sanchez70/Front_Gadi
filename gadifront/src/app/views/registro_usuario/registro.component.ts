import { Component, OnInit } from '@angular/core';
import { Persona } from '../../Services/docenteService/persona';
import { Titulo_profesional } from '../../Services/titulo/titulo_profesional';
import { TipoContratoService } from '../../Services/tipo_contrato/tipo-contrato.service';
import { GradoOcupacionalService } from '../../Services/grado/grado-ocupacional.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistroService } from '../../Services/registroService/registro.service';
import { DocenteService } from '../../Services/docenteService/docente.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../Services/loginService/usuario';
import { UsuarioRol } from '../../Services/UsuarioRol/usuarioRol';
import { ValidacionesComponent } from '../../validaciones/validaciones.component';
import { Tipo_contrato } from '../../Services/tipo_contrato/tipo_contrato';
import { Grado_ocupacional } from '../../Services/grado/grado_ocupacional';

@Component({
  selector: 'app-registro',
  templateUrl: './form_registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public registroForm1: FormGroup;
  //public registroForm2: FormGroup;
  public edad: number = 0;
  //public gradoSeleccionado: number = 0;
  //public id_grado: number = 0;
  // public contratoSelec: number = 0;
  // public id_contrato: number = 0;
  public persona: Persona = new Persona();
  public user: Usuario = new Usuario();
  public titulo: Titulo_profesional = new Titulo_profesional();
  public usuarioRol: UsuarioRol = new UsuarioRol();
  public contratos: Tipo_contrato[] = [];
  public grados: Grado_ocupacional[] = [];

  showFinalForm: boolean = false;
  public isTiempoParcial: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: RegistroService,
    private tipoContratoService: TipoContratoService,
    private gradoOcupacionalService: GradoOcupacionalService,
    private docenteService: DocenteService
  ) {
    this.registroForm1 = this.fb.group({
      name1: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyLettersValidator())]],
      name2: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyLettersValidator())]],
      lastname1: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyLettersValidator())]],
      lastname2: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternOnlyLettersValidator())]],
      user: ['', [Validators.required, this.validateCedulaEcuatoriana]],
      password: ['', [Validators.required, Validators.pattern(ValidacionesComponent.patternPasswordValidator())]],
      telefono: ['', [Validators.required, this.validateTelefono]],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      fecha_nacimiento: ['', Validators.required],
      edad: ['', Validators.required],
      fecha_vinculacion: ['', Validators.required],
      titulos: this.fb.array([]),
      nombre_grado_ocp: ['', Validators.required],
      nombre_contrato: ['', Validators.required],
      hora_contrato: ['', [Validators.required, Validators.min(1)]]
    });
  }
  ngOnInit() {
    this.loadContratos();
    this.loadGradoOcupacional();
  }

  loadContratos() {
    this.tipoContratoService.getContrato().subscribe(data => {
      this.contratos = data;
    });
  }

  loadGradoOcupacional() {
    this.gradoOcupacionalService.getGrado().subscribe(data => {
      this.grados = data;
    });
  }

  get titulos() {
    return this.registroForm1.get('titulos') as FormArray;
  }

  addTitulo() {
    const tituloForm = this.fb.group({
      nombre_titulo: ['', Validators.required],
      grado: ['', Validators.required]
    });
    this.titulos.push(tituloForm);
  }

  removeTitulo(index: number) {
    this.titulos.removeAt(index);
  }

  validateCedulaEcuatoriana(control: AbstractControl): ValidationErrors | null {
    const cedula = control.value;

    if (cedula.length !== 10) {
      return { invalidLength: true };
    }

    if (!/^\d{10}$/.test(cedula)) {
      return { invalidCharacters: true };
    }

    const digitos = cedula.split('').map(Number);

    const codigoProvincia = digitos[0] * 10 + digitos[1];
    if ((codigoProvincia < 1 || codigoProvincia > 24) && codigoProvincia !== 30) {
      return { invalidProvince: true };
    }
    const tercerDigito = digitos[2];
    if (tercerDigito < 0 || tercerDigito > 6) {
      return { invalidThirdDigit: true };
    }
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let digito = digitos[i] * coeficientes[i];
      if (digito >= 10) {
        digito -= 9;
      }
      suma += digito;
    }

    const digitoVerificador = digitos[9];
    const sumaMod10 = suma % 10;
    const resultadoVerificador = sumaMod10 === 0 ? 0 : 10 - sumaMod10;

    if (resultadoVerificador !== digitoVerificador) {
      return { invalidCedula: true };
    }

    return null;
  }
  calcularEdad(event: any): void {
    const fechaNacimiento = new Date(event.target.value);
    const fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    const mes = fechaActual.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    this.edad = edad;
    this.registroForm1.get('edad')?.setValue(edad);
  }

  validateTelefono(control: AbstractControl): ValidationErrors | null {
    const telefono = control.value;
    if (!/^\d{10}$/.test(telefono)) {
      return { invalidLength: true };
    }
    if (!/^09\d{8}$/.test(telefono)) {
      return { invalidFormat: true };
    }
    return null;
  }

  
  // onContratoChange(event: any) {
  //   this.contratoSelec = +event.target.value;
  //   this.id_contrato = this.contratoSelec;
  // }

  onSubmit(): void {
    if (this.registroForm1.invalid) {
      this.registroForm1.markAllAsTouched();
      return;
    }

    const registroData = this.registroForm1.value;

   // const { name1, name2, lastname1, lastname2, user, password } = this.registroForm1.value;

  //   this.docenteService.getPersona().subscribe(personas => {
  //     if (personas.find(persona => persona.cedula === registroData.user)) {
  //       Swal.fire('Error', 'La cédula ya está registrada', 'error');
  //     } else {
  //       localStorage.setItem('registroData', JSON.stringify({
  //         primer_nombre: name1,
  //         segundo_nombre: name2,
  //         primer_apellido: lastname1,
  //         segundo_apellido: lastname2,
  //         usuario: user,
  //         password: password
  //       }));
  //       this.showFinalForm = true;
  //     }
  //   }, error => {
  //     console.error('Error al obtener personas:', error);
  //     Swal.fire('Error', 'Hubo un problema al obtener personas.', 'error');
  //   });
  // }

  // onSubmit2(): void {
  //   const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');

  //   this.persona.cedula = registroData.usuario,
  //     this.persona.nombre1 = registroData.primer_nombre,
  //     this.persona.nombre2 = registroData.segundo_nombre,
  //     this.persona.apellido1 = registroData.primer_apellido,
  //     this.persona.apellido2 = registroData.segundo_apellido,
  //     this.persona.telefono = this.registroForm2.value.telefono,
  //     this.persona.direccion = this.registroForm2.value.direccion,
  //     this.persona.correo = this.registroForm2.value.correo,
  //     this.persona.edad = this.edad,
  //     this.persona.fecha_vinculacion = this.registroForm2.value.fecha_vinculacion,
  //     this.persona.id_tipo_contrato = this.id_contrato,
  //     this.persona.id_grado_ocp = this.id_grado
  //   this.service.createPer(this.persona).subscribe(personaRegistrada => {
  //     this.user.usuario = this.persona.cedula,
  //       this.user.contrasena = registroData.password,
  //       this.user.id_persona = personaRegistrada.id_persona,
  //       this.service.createUser(this.user).subscribe(usuarioRegistrado => {
  //         this.usuarioRol.id_rol = 3,
  //           this.usuarioRol.id_usuario = usuarioRegistrado.id_usuario
  //         this.service.createUserRol(this.usuarioRol).subscribe(() => {
  //           this.titulos.controls.forEach((tituloControl) => {
  //             this.titulo = new Titulo_profesional();
  //             this.titulo.nombre_titulo = tituloControl.value.nombre_titulo;
  //             this.titulo.grado = tituloControl.value.grado;
  //             this.titulo.id_persona = personaRegistrada.id_persona;
  //             this.service.createTitulo(this.titulo).subscribe(
  //               () => {
  //                 console.log('Título guardado correctamente');
  //               },
  //               (error) => {
  //                 console.error('Error al crear título:', error);
  //                 Swal.fire('Error', 'Hubo un problema al crear el título.', 'error');
  //               }
  //             );
  //           });
  //         });

  //         Swal.fire('Registro exitoso', '', 'success');
  //         this.router.navigate(['./login']);
  //       }, error => {
  //         console.error('Error al crear usuario:', error);
  //         Swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
  //       });
  //   }, error => {
  //     console.error('Error al crear persona:', error);
  //     Swal.fire('Error', 'Hubo un problema al crear la persona.', 'error');
  //   });
  // }
  // onGradoChange(event: any): void {
  //   this.gradoSeleccionado = +event.target.value;
  //   this.id_grado = this.gradoSeleccionado;
  this.docenteService.getPersona().subscribe(personas => {
    if (personas.find(persona => persona.cedula === registroData.user)) {
      Swal.fire('Error', 'La cédula ya está registrada', 'error');
    } else {
      this.persona.cedula = registroData.user;
      this.persona.nombre1 = registroData.name1;
      this.persona.nombre2 = registroData.name2;
      this.persona.apellido1 = registroData.lastname1;
      this.persona.apellido2 = registroData.lastname2;
      this.persona.telefono = registroData.telefono;
      this.persona.direccion = registroData.direccion;
      this.persona.correo = registroData.correo;
      this.persona.edad = this.edad;
      this.persona.fecha_vinculacion = registroData.fecha_vinculacion;
      this.persona.id_grado_ocp = registroData.nombre_grado_ocp;
      this.persona.id_tipo_contrato = registroData.nombre_contrato;

      this.service.createPer(this.persona).subscribe(personaRegistrada => {
        this.user.usuario = this.persona.cedula;
        this.user.contrasena = registroData.password;
        this.user.id_persona = personaRegistrada.id_persona;

        this.service.createUser(this.user).subscribe(usuarioRegistrado => {
          this.usuarioRol.id_rol = 3;
          this.usuarioRol.id_usuario = usuarioRegistrado.id_usuario;

          this.service.createUserRol(this.usuarioRol).subscribe(() => {
            this.titulos.controls.forEach((tituloControl) => {
              this.titulo = new Titulo_profesional();
              this.titulo.nombre_titulo = tituloControl.value.nombre_titulo;
              this.titulo.grado = tituloControl.value.grado;
              this.titulo.id_persona = personaRegistrada.id_persona;

              this.service.createTitulo(this.titulo).subscribe(
                () => {
                  console.log('Título guardado correctamente');
                },
                (error) => {
                  console.error('Error al crear título:', error);
                  Swal.fire('Error', 'Hubo un problema al crear el título.', 'error');
                }
              );
            });
            Swal.fire('Registro exitoso', '', 'success');
            this.router.navigate(['./login']);
          });
        }, error => {
          console.error('Error al crear usuario:', error);
          Swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
        });
      }, error => {
        console.error('Error al crear persona:', error);
        Swal.fire('Error', 'Hubo un problema al crear la persona.', 'error');
      });
    }
  });  
}
}