import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WeatherApiProvider } from '../../providers/weather-api/weather-api';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { WeatherModel } from '../../model/watherReq.model';
import { UvReqModel } from '../../model/uvReq.model';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { UvProvider } from '../../providers/uv/uv';


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
  uvIndex: number;

  private lang: string;


  constructor(
    public navCtrl: NavController,
    private weatherProv: WeatherApiProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    public translateService: TranslateService,
    private locNot: LocalNotifications,
    private uvProv: UvProvider) {
  }



  ionViewDidEnter() {
    this.getLanguage();
    this.getWeather();
  }

  private setNotification() {
    if (this.uvIndex > 5) {
      this.locNot.isPresent(1).then((res: boolean) => {
        if (!res) {
          this.locNot.schedule({
            id: 1,
            title: 'UV Index',
            text: 'Use protetor solar',
            foreground: true
          });
        }
      })
    }
  }

  private async getLanguage() {
    await this.storage.get('language').then((res) => {
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

  getUV(lat, lon) {
    this.uvProv.getUvIndex(lat, lon).subscribe(
      (uv: UvReqModel) => {
        console.log(uv);
        this.uvIndex = Math.floor(Number(uv.data[0].uv));
        this.setNotification();
      }
    );

  }


  private async getWeather() {
    await this.storage.get('location').then((val) => {
      if (val != null) {
        this.location = JSON.parse(val);
        if (this.location.geolocation == false) {
          this.weatherProv.getWeather(this.location.city, this.location.state, 'br', this.lang)
            .subscribe((wea: WeatherModel) => {
              this.weather = wea;
              this.getUV(wea.coord.lat, wea.coord.lon)
            },
              () => {
                this.alertLocationNotFound();
              });
        } else {
          this.location = JSON.parse(val);
          this.weatherProv.getWeatherGeol(this.location.lat, this.location.log, this.lang)
            .subscribe((wea: WeatherModel) => {
              this.weather = wea;
              this.getUV(wea.coord.lat, wea.coord.lon)
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

  uvInfo() {
    let title: any;
    let message: string;
    if (this.uvIndex < 3) {
      this.translateService.get('UVLOW').subscribe(
        res => {
          title = res;
          this.translateService.get('UVLOWMES').subscribe(
            mes => {
              message = mes
              this.createAlert(title, message);
            }
          )
        }
      )
    } if (this.uvIndex < 6 && this.uvIndex > 2) {
      this.translateService.get('UVMOD').subscribe(
        res => {
          title = res;
          this.translateService.get('UVMODMES').subscribe(
            mes => {
              message = mes
              this.createAlert(title, message);
            }
          )
        }
      )
    }
    if (this.uvIndex < 8 && this.uvIndex > 5) {
      this.translateService.get('UVHIG').subscribe(
        res => {
          title = res;
          this.translateService.get('UVHIGMES').subscribe(
            mes => {
              message = mes
              this.createAlert(title, message);
            }
          )
        }
      )

    }
    if (this.uvIndex < 11 && this.uvIndex > 7) {
      this.translateService.get('UVVHI').subscribe(
        res => {
          title = res;
          this.translateService.get('UVVHIMES').subscribe(
            mes => {
              message = mes
              this.createAlert(title, message);
            }
          )
        }
      )
    }
    if (this.uvIndex > 10) {
      this.translateService.get('UVEXT').subscribe(
        res => {
          title = res;
          this.translateService.get('UVEXTMES').subscribe(
            mes => {
              message = mes
              this.createAlert(title, message);
            }
          )
        }
      )

    }
  }

  private createAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

}
