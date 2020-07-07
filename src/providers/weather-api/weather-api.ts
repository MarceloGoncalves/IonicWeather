import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { keyApi } from '../../key/apiKey';

import 'rxjs/add/operator/map';

@Injectable()
export class WeatherApiProvider {
  private url: string;
  private key = keyApi;

  constructor(public http: HttpClient) {
    this.url = "http://api.openweathermap.org/data/2.5/weather?";
  }
  ionViewDidLoad() {
    console.log("WeatherApi");
  }

  getWeather(city, state, country) {
    return this.http.get(this.url+'q='+ city + ',' + state + ',' +
                           country + '&appid=' + this.key+'&units=metric'+'&lang=pt_br');
  }
  getWeatherGeol(lat, lon){
    return this.http.get(this.url+'lat='+lat+'&lon='+lon+'&appid=' + this.key+'&units=metric'+'&lang=pt_br');
  }

}
