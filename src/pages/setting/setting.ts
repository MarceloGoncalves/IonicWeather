import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  city: String;
  state: String;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage) {
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

  saveForm() {
    let location = {
      city: this.city,
      state: this.state
    }
    this.storage.set('location', JSON.stringify(location));
    this.navCtrl.push(HomePage);
  }



}
