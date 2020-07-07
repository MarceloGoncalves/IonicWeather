import { Geolocation, Geoposition } from '@ionic-native/geolocation';

export class GeolocationMock extends Geolocation {
    latitude = 1;
    longitude = 1;


    getCurrentPosition(options) {
      return new Promise<Geoposition>((resolve) => {
        resolve({
          coords: {
            latitude: this.latitude,
            longitude: this.longitude,
            accuracy: 1,
            altitude: 100,
            altitudeAccuracy: 1,
            heading: 1,
            speed:1,
          },
          timestamp:10000
        })
      });
    }
  
    setLatitude(latitude) {
      this.latitude = latitude;
      console.log("Latitude changed to: ", latitude);
    }
  
    setLongitude(longitude) {
      this.longitude = longitude;
      console.log("Longitude changed to: ", longitude);
    }
  }
