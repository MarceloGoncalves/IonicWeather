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

  private lang: string;


  constructor(
    public navCtrl: NavController,
    private weatherProv: WeatherApiProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public translateService: TranslateService) {
  }



  ionViewDidEnter() {
    this.getLanguage();
    this.getWeather();
  }

  private async getLanguage() {
    await this.storage.get('language').then((res) => {
      console.log(res)
      if (res != null) {
        this.translateService.setDefaultLang(res);
        (res == 'br') ? this.lang = 'pt_br' : this.lang = 'en';
      }
      else {
        this.translateService.setDefaultLang('br');
        this.lang = 'pt_br';
      }
    })

  }


  private async getWeather() {
    this.getLanguage();
    await this.storage.get('location').then((val) => {
      if (val != null) {
        this.location = JSON.parse(val);
        if (this.location.geolocation == false) {
          this.weatherProv.getWeather(this.location.city, this.location.state, 'br', this.lang)
            .subscribe(wea => {
              this.weather = wea;
            },
              () => {
                this.alertLocationNotFound();
              });
        } else {
          this.location = JSON.parse(val);
          this.weatherProv.getWeatherGeol(this.location.lat, this.location.log, this.lang)
            .subscribe(wea => {
              this.weather = wea;
            },
              () => {
                this.alertLocationNotFound();
              });
        }
      } else {
        this.alertLocationNotFound();
      }
    })
  }

  private async alertLocationNotFound() {

    let titleValue: string;
    let erroMessage: string;

    this.translateService.get('LOCNOTFOUND').subscribe(
      value => {
        titleValue = value;
        this.translateService.get('ERROMESSAGE').subscribe(
          value => {
            erroMessage = value;
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
        );
      }
    );
  }
}
