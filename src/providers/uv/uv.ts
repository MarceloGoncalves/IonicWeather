import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UvProvider {

  url: string;
  headers: HttpHeaders;

  constructor(public http: HttpClient) {
    this.url = 'https://api.openuv.io/api/v1/uv';
    this.headers = new HttpHeaders().append('x-access-token','dc59477761d044942b8ff23d7d9775ea');
  }

  getUvIndex(lat: String, lng: String) {
    const requestOptions = {                                                                                                                                                                                 
      headers: this.headers 
    };
    let date = new Date().toISOString();
    console.log(this.headers.keys());
    return this.http.get(this.url + '?lat=' + lat + '&lng=' + lng + '&dt=' + date, requestOptions);
  }


}
