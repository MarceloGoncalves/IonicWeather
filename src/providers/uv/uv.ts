import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { keyUvApi } from '../../key/apiKey';

@Injectable()
export class UvProvider {

  private url: string;
  private key = keyUvApi;

  constructor(public http: HttpClient) {
    this.url = 'https://api.weatherbit.io/v2.0/current';
  }

  getUvIndex(lat: String, lng: String) {
    return this.http.get(this.url + '?lat=' + lat + '&lon=' + lng + '&key=' + this.key);
  }

}
