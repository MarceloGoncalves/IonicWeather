import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { LocationApiProvider } from '../../providers/location-api/location-api';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})

export class SettingPage {
  city: String;
  citys: string[];
  ufs = [];
  state: String;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public geolocation: Geolocation,
    private locProvider: LocationApiProvider,
    private alertCtrl: AlertController) {

    this.getUf();
  }

  getUf() {
    this.locProvider.getUF().subscribe(res => {
      this.ufs = res;
    });
  }

  getCity() {
    if (this.state != null) {
      this.locProvider.getCity(this.state).subscribe((res: string[]) => {
        this.citys = res;
      })
    }
  }

  selectChange() {
    this.getCity();
  }

  ionViewDidLoad() {
    this.storage.get('location')
      .then(res => {
        if (res != null) {
          let location = JSON.parse(res);
          this.city = location.city;
          this.state = location.state;
        } else {
          this.city = 'Quixadá';
          this.state = 'ce';
        }
      })
  }

  alertSetLocation() {
    let alert = this.alertCtrl.create({
      title: 'Set Location',
      subTitle: 'you need to set state and city',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  saveForm() {
    if ((this.city && this.state) != undefined) {
      let location = {
        geolocation: false,
        city: this.city,
        state: this.state.toLowerCase()
      }
      this.storage.set('location', JSON.stringify(location));
      this.navCtrl.parent.select(0);
    }else{

    }
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let location = {
        geolocation: true,
        lat: resp.coords.latitude,
        log: resp.coords.longitude
      }
      this.storage.set('location', JSON.stringify(location));
      this.navCtrl.parent.select(0);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
