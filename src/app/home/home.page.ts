import { Component } from '@angular/core';
import { MuseumService, Exhibitions, Artworks, ipAddress, Beacons } from '../services/museum.service';
import { BLE } from '@ionic-native/ble/ngx';
import { AlertController } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';

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
    private badge:Badge
  ) { }

  //Carga todos lo metodos solo cuando la App este lista
  ionViewDidEnter() {
    this.getExhibitions();
    this.getBeacons();
    this.isEnabled();
  }


  //Revisa si Bluetooth esta activado. Si es así escanea el Beacon. 
  //En caso contratio saldrá un Alert pidiendo al usuario que lo active.
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

  //Lanza un Alert con el mensaje escrito.
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'BLUETOOTH',
      message: 'Please, turn on Bluetooth to use App',
      buttons: ['OK']
    });

    await alert.present();
  }

  //Obtiene un Array con todos lo Beacons de la Base de datos
  getBeacons() {
    this.apiMuseum.getBeaconsFromBackEnd().subscribe((res: Array<Beacons>) => {
      this.beaconArray = res;
      console.log("GetBeacons: " + this.beaconArray);
    })
  }

  //Escanea todos los beacons que tiene cerca.
  //Si este esta en la BD muestra la información asociada al mismo.
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

  //Metodos que en principio nos sirven para mostrar y limpiar las notificaciones.

    // async increaseBadge(badgeNumber: number){
  //   try{
  //     let badge = await this.badge.increase(badgeNumber);
  //     console.log(badge);
  //   }catch(e){
  //     console.error(e)
  //   }
  // }

  // async setBadges(badgeNumber: number){
  //   try{
  //     let badges = await this.badge.set(badgeNumber);
  //     console.log(badges);
  //   }catch(e){
  //     console.error(e);
  //   }
  // }

  // async getBadges(){
  //   try{
  //     let badgeAmount = await this.badge.get();
  //     console.log(badgeAmount);
  //   }catch(e){
  //     console.error(e);
  //   }
  // }



  //Obtiene un Array con los datos de la descripción de la exhibición.
  getExhibitions() {
    this.apiMuseum.getExhibitionsFromBackEnd().subscribe((res: Array<Exhibitions>) => {
      this.exhibitArray = res;
      console.log("GetExhibitions: " + this.exhibitArray);
    })
  }

  //Obtiene un Array con los datos de la obra. (Se nececita para poder cargar los archivos multimedia)
  getArtworks() {
    this.apiMuseum.getArtworksFromBackEnd().subscribe((res: Array<Artworks>) => {
      this.artArray = res;
      console.log("GetArtworks: " + this.artArray);
    })
  }

  //Permite cambiar de Media y reaccionar a lo que esta escogiendo el usuario.
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

  //Una vez el usuario escoge Media, este metodo la carga en la pantalla.
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
