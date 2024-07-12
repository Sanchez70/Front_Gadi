import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { PersonaService } from '../../../Services/personaService/persona.service';
import { SrolService } from '../../../Services/rol/srol.service';
import { UsuarioRolService } from '../../../Services/UsuarioRol/usuario-rol.service';

@Component({
  selector: 'app-main-coordiandor',
  templateUrl: './main-coordiandor.component.html',
})
export class MainCoordiandorComponent {

  ngOnInit(): void {
  }
}