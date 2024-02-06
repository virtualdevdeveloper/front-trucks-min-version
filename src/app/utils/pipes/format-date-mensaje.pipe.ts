import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateMensaje',
})
export class FormatDateMensajePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);

    date.setHours(date.getHours() + 1); // Ajuste para GMT+1 (España)
    date.setHours(date.getHours() - 5); // Convertimos a GMT-3 (Argentina)

    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const formattedTime = `${this.padZero(date.getHours())}:${this.padZero(
      date.getMinutes()
    )}:${this.padZero(date.getSeconds())}`;

    return `${formattedDate} ${formattedTime}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
