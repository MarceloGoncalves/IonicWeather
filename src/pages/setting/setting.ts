import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { LocationApiProvider} from '../../providers/location-api/location-api';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  city: String;
  citys = [];
  ufs = [];
  state: String;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public geolocation: Geolocation,
    private locProvider: LocationApiProvider) {

      this.getGeolocation();
      this.getUf();
  }

  getUf(){
    this.locProvider.getUF().subscribe(res => {
      this.ufs = res;
    });
  }

  getCity(){
    if(this.state != null){
      this.locProvider.getCity(this.state).subscribe(res =>{
        this.citys = res;
      })
    }
  }

  /* getItems(ev: any){
    this.getStates();

    const val = ev.target.value;

    if(val && val.trim() != ''){
      this.states = this.states.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })

    }
  } */

  selectChange(){
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

  saveForm() {
    let location = {
      city: this.city,
      state: this.state.toLowerCase()
    }
    this.storage.set('location', JSON.stringify(location));
    this.navCtrl.parent.select(0);
  }

  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }



}
