import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WeatherApiProvider } from '../../providers/weather-api/weather-api';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weather: any;
  location: {
    city: String,
    state: String,
  }


  constructor(
    public navCtrl: NavController,
    private weatherProv: WeatherApiProvider,
    private storage: Storage) {
  }

 

  ionViewDidEnter(){
    this.getWeather();
  }

  private async getWeather(){
    await this.storage.get('location').then((val) => {
      if (val != null) {
        this.location = JSON.parse(val);
      } else {
        this.location = {
          city: 'quixada',
          state: 'ce'
        }
      }
    })

    this.weatherProv.getWeather(this.location.city, this.location.state, 'br')
      .subscribe(wea => {
        this.weather = wea;
      });

  }



}
