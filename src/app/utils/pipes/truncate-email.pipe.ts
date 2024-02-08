import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateEmail'
})
export class TruncateEmailPipe implements PipeTransform {

  transform(email: string): string {
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.substring(0, atIndex) : email;
  }

}
