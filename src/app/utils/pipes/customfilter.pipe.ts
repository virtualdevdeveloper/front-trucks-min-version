import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customfilter'
})
export class CustomfilterPipe implements PipeTransform {

  transform(items: any[], term: any, field: string): any {
    if (!term || !items) return items;
    return items.filter(item => item[field] && item[field].toLowerCase().indexOf(term.toLowerCase()) > -1);
  }

}
