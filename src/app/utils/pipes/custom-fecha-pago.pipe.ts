import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFechaPago'
})
export class CustomFechaPagoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
