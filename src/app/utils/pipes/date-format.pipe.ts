import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(dateString: string): string {
    if (!dateString) return dateString;

    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;

    // Formatear la fecha a DD-MM-YYYY
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

}
