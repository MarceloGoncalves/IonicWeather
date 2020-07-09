import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class LocationApiProvider {

  private url: string;

  constructor(public http: HttpClient) {
    this.url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
  }

  getUF(){
    return this.http.get<Object[]>(this.url);
  }

  getCity(uf:String){
    return this.http.get<Object[]>(this.url +'/'+uf+'/municipios');
  }

}
