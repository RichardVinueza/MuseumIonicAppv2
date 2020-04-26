import { Component } from '@angular/core';
import { MuseumService, Exhibitions, Artworks, ipAddress, Beacons } from '../services/museum.service';
import { BLE } from '@ionic-native/ble/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ipAddress = ipAddress;

  devices: any[] = [];
  beaconArray: Array<Beacons> = [];
  auxDevice: any;
  beacon: Beacons;
  bluetoothState: string;

  exhibitArray: Array<Exhibitions> = [];
  exhibit: Exhibitions;

  artArray: Array<Artworks> = [];
  artArrayShow = new Array<Artworks>();
  art: Artworks;
  imgArtwork: any;

  typeFileChoices: [String];

  constructor(
    private apiMuseum: MuseumService,
    private ble: BLE,
    public alertController: AlertController,
  ) { }

  ionViewDidEnter() {
    this.getExhibitions();
    this.getBeacons();
    this.isEnabled();
    this.BadgeDeviceReady();
  }



  isEnabled() {
    this.ble.startStateNotifications().subscribe(state => {
      console.log("Bluetooth is " + state);
      this.bluetoothState = state;
      if (this.bluetoothState == 'on') {
        this.scanForBeacons();

      } else if (this.bluetoothState == 'off') {
        this.presentAlert();
      }
    });
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'BLUETOOTH',
      message: 'Please, turn on Bluetooth to use App',
      buttons: ['OK']
    });

    await alert.present();
  }

  getBeacons() {
    this.apiMuseum.getBeaconsFromBackEnd().subscribe((res: Array<Beacons>) => {
      this.beaconArray = res;
      console.log("GetBeacons: " + this.beaconArray);
    })
  }

  //El plugin es accesible una vez el dispostivo este en funcionamiento
  BadgeDeviceReady() {
    document.addEventListener('deviceready', function () {
      // cordova.plugins.notification.badge is now available
    }, false);
  }

  scanForBeacons() {
    console.log("SCAN...");
    this.ble.startScan([]).subscribe(device => {
      if (device.name) {
        console.log(JSON.stringify(device));
      }
      for (this.beacon of this.beaconArray) {
        if (this.beacon.mac == device.id) {
          console.log("IDs MATCH");
          document.getElementById("load-exhibit").style.display = "block";
          this.getArtworks();
        }
      }
    });
    console.log("BEACON FOUND");
  }

  getExhibitions() {
    this.apiMuseum.getExhibitionsFromBackEnd().subscribe((res: Array<Exhibitions>) => {
      this.exhibitArray = res;
      console.log("GetExhibitions: " + this.exhibitArray);
    })
  }

  getArtworks() {
    this.apiMuseum.getArtworksFromBackEnd().subscribe((res: Array<Artworks>) => {
      this.artArray = res;
      console.log("GetArtworks: " + this.artArray);
    })
  }

  changeTypeFile(event) {
    let fileChoice: [String] = event.detail.value;
    if (fileChoice == []) {
      this.typeFileChoices = ["image"];
      this.typeFileChoices = ["audio"];
      this.typeFileChoices = ["video"];
      this.artArrayShow = this.artArray;
    } else {
      this.loadArtWorkShow(fileChoice);
    }
  }

  loadArtWorkShow(fileChoice: [String]) {
    this.artArrayShow = new Array<Artworks>();
    for (let art of this.artArray) {
      let mediaShow = false;
      for (let media of art.media) {
        if (fileChoice.includes(media.fileType)) {
          mediaShow = true;
        }
      }
      if (mediaShow == true) {
        this.artArrayShow.push(art);
      }
    }
    console.log(this.artArrayShow);
  }

}
