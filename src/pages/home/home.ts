import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WeatherApiProvider } from '../../providers/weather-api/weather-api';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weather: any;
  location: {
    city: String,
    state: String,
    lat: String,
    log: String,
    geolocation: boolean
  }


  constructor(
    public navCtrl: NavController,
    private weatherProv: WeatherApiProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public translateService:TranslateService) {
  }

  ionViewDidEnter() {
    this.getWeather();
    this.getLinguage();
  }

  private async getLinguage(){
    await this.storage.get('language').then((res) =>{
      if(res != null){
        this.translateService.setDefaultLang(res);
      }
      else{
        this.translateService.setDefaultLang('br');
      }
    })
  }


  private async getWeather() {
    await this.storage.get('location').then((val) => {
      if (val != null) {
        this.location = JSON.parse(val);
        console.log(location);
        if (this.location.geolocation == false) {
          console.log("geolocation false");
          this.weatherProv.getWeather(this.location.city, this.location.state, 'br')
            .subscribe(wea => {
              this.weather = wea;
            },
              (err) => {
                console.log(err.error)
                this.alertLocationNotFound();
              });
        } else {
          console.log("geolocation true");
          this.location = JSON.parse(val);
          this.weatherProv.getWeatherGeol(this.location.lat, this.location.log)
            .subscribe(wea => {
              this.weather = wea;
            },
              (err) => {
                console.log(err.error)
                this.alertLocationNotFound();
              });
        }
      } else {
        this.alertLocationNotFound();
      }
    })
  }

  alertLocationNotFound() {
    let titleValue: string; 
    let erroMessage: string;

    this.translateService.get('LOCNOTFOUND').subscribe(
      value => {
        titleValue = value;
      }
    );
    this.translateService.get('ERROMESSAGE').subscribe(
      value => {
        erroMessage = value;
      }
    )

    let alert = this.alertCtrl.create({
      title: titleValue,
      message: erroMessage,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.parent.select(1);
          }
        }
      ]
    });
    alert.present();
  }
}
