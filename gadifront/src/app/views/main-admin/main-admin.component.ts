import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { PersonaService } from '../../Services/personaService/persona.service';
import { SrolService } from '../../Services/rol/srol.service';
import { UsuarioRolService } from '../../Services/UsuarioRol/usuario-rol.service';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
})
export class MainAdminComponent {

  ngOnInit(): void {
  }
}