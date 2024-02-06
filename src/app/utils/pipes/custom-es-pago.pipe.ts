import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customEsPago'
})
export class CustomEsPagoPipe implements PipeTransform {

  transform(esPago: boolean): string {
    return esPago ? 'Pagó' : 'No pagó';
  }

}
