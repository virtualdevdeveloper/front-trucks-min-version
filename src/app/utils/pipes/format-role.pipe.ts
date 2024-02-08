import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatRole'
})
export class FormatRolePipe implements PipeTransform {

  transform(role: string): string {
    const formattedRole = role.replace('_', ' ');

    // Si es "dador_carga", devuelve "Dador de Carga"
    if (formattedRole === 'dador carga') {
      return 'Dador de Carga';
    }

    // Capitalizar la primera letra y mantener el resto en minúsculas
    return formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1).toLowerCase();
  }

}
