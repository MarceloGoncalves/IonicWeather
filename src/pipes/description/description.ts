import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description',
})
export class DescriptionPipe implements PipeTransform {

  transform(value: string) {

    let firstletter = value.substring(0, 1);
    let restOfString = value.substring(1);

    firstletter = firstletter.toLocaleUpperCase();
    restOfString = restOfString.toLocaleLowerCase();

    let merged = firstletter + restOfString;
    return merged;

  }
}
