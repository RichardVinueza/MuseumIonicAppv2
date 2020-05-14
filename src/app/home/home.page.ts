import { Component, NgZone } from "@angular/core";
import {
  MuseumService,
  Exhibitions,
  Artworks,
  ipAddress,
  Beacons,
} from "../services/museum.service";
import { BLE } from "@ionic-native/ble/ngx";
import { AlertController } from "@ionic/angular";
import { Badge } from "@ionic-native/badge/ngx";
import { AnimationController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  ipAddress = ipAddress;

  badgeNumber: number;
  bounceAnimation: any;

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
    private ngZone: NgZone,
    public alertController: AlertController,
    private badge: Badge,
    private animationCtrl: AnimationController
  ) {}

  //Carga todos lo métodos solo cuando la App este lista
  ionViewDidEnter() {
    this.isEnabled();
    this.createBounceAnimation();
  }

  //ESTADO DE BLUETOOH Y DETECCIÓN DE BEACONS

  //Revisa si Bluetooth esta activado. Si es así escanea el Beacon.
  //En caso contratio saldrá un Alert pidiendo al usuario que lo active.
  isEnabled() {
    this.ble.startStateNotifications().subscribe((state) => {
      console.log("Bluetooth is " + state);
      this.bluetoothState = state;
      if (this.bluetoothState == "on") {
        this.getBeacons();
        this.scanForBeacons();
      } else if (this.bluetoothState == "off") {
        this.presentAlert();
      }
    });
  }

  //Lanza un Alert con el mensaje escrito.
  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Alert",
      subHeader: "BLUETOOTH",
      message: "Please, turn on Bluetooth to use App",
      buttons: ["OK"],
    });

    await alert.present();
  }

  //Escanea todos los beacons que tiene cerca.
  //Si este esta en la BD muestra la información asociada al mismo.
  async scanForBeacons() {
    this.devices = [];
    let scan = await this.ble.startScan([]).subscribe((device) => {
      if (scan) {
        this.onDeviceDiscovered(device);
      }
    });
  }

  onDeviceDiscovered(device) {
    this.ngZone.run(() => {
      for (this.beacon of this.beaconArray) {
        if (this.beacon.mac == device.id) {
          console.log("IDs MATCH");
          console.log("BEACON FOUND");
          setTimeout(() => {
            this.increaseBadges();
            this.bounceAnimation.play();
          }, 800);
          let btnNotification = document.getElementById("bounce");
          btnNotification.addEventListener("click", () => {
            this.showContent();
          });
        }
      }
    });
  }

  // async scanForBeacons() {
  //   console.log("SCAN...");
  //   let scanConfirmed = await this.ble.startScan([]).subscribe((device) => {
  //     if (device.name) {
  //       console.log(JSON.stringify(device));
  //     }
  //     for (this.beacon of this.beaconArray) {
  //       if (this.beacon.mac == device.id) {
  //         console.log("IDs MATCH");
  //         console.log("BEACON FOUND");
  //       }
  //     }
  //   });
  //   if (scanConfirmed) {
  //     setTimeout(() => {
  //       this.setBadges();
  //       this.increaseBadges();
  //       this.bounceAnimation.play();
  //     }, 2000);
  //     let btnNotification = document.getElementById("bounce");
  //     btnNotification.addEventListener("click", () => {
  //       this.showContent();
  //     });
  //   }
  // }

  //CARGAR Y MOSTRAR CONTENIDO

  //Este método muestra el contenido después de haberse cumplido la promesa "scanConfirmed"
  // y el usuario haber pulsado el botón de las notificaciones.
  async showContent() {
    let bounceAwait = this.bounceAnimation.pause();
    if (bounceAwait) {
      this.decreaseBadges();
      this.getExhibitions();
      this.getArtworks();
    }
  }

  //NOTIFICACIONES Y ANIMACIONES

  //Métodos que en principio nos sirven para mostrar las notificaciones tras haber detectado un beacon.
  async increaseBadges() {
    try {
      this.badgeNumber = await this.badge.increase(1);
      console.log(this.badgeNumber);
    } catch (e) {
      console.log(e);
    }
  }

  async decreaseBadges() {
    try {
      this.badgeNumber = await this.badge.decrease(1);
      console.log(this.badgeNumber);
    } catch (e) {
      console.log(e);
    }
  }

  //Dos formas de crear una animación de rebote al recibir una notioficación.

  // 1º forma:  https://ionicframework.com/docs/utilities/animations
  //Esta forma es mejor ya que primero solo se crea la animación y luego decidimos utilizarla donde y cuando corresponda.
  createBounceAnimation() {
    this.bounceAnimation = this.animationCtrl
      .create()
      .addElement(document.querySelector("#bounce"))
      .duration(600)
      .iterations(Infinity)
      .keyframes([
        { offset: 0, transform: "translateY(0px)" },
        { offset: 0.5, transform: "translateY(-6px)" },
        { offset: 1, transform: "translateY(0px)" },
      ]);
  }

  //2º forma: https://developer.mozilla.org/es/docs/Web/API/Element/animate
  //Igual de válida que la anterior, pero que se ejecuta desde el principio y es menos dinámica.

  // playBounceAnimation() {
  //   console.log("BOUNCE ANIMATION");
  //   this.bounceAnimation = document.getElementById("bounce").animate(
  //     [
  //       // keyframes
  //       { transform: "translateY(0px)" },
  //       { transform: "translateY(-6px)" },
  //       { transform: "translateY(0px)" },
  //     ],
  //     {
  //       // timing options
  //       duration: 600,
  //       iterations: Infinity,
  //     }
  //   );
  // }

  //PETICIONES AL BACKEND

  //Obtiene un Array con todos lo Beacons de la Base de datos
  getBeacons() {
    this.apiMuseum.getBeaconsFromBackEnd().subscribe((res: Array<Beacons>) => {
      this.beaconArray = res;
      console.log("GetBeacons: " + this.beaconArray);
    });
  }

  //Obtiene un Array con los datos de la descripción de la exhibición.
  getExhibitions() {
    this.apiMuseum
      .getExhibitionsFromBackEnd()
      .subscribe((res: Array<Exhibitions>) => {
        this.exhibitArray = res;
        console.log("GetExhibitions: " + this.exhibitArray);
      });
  }

  //Obtiene un Array con los datos de la obra. (Se nececita para poder cargar los archivos multimedia)
  getArtworks() {
    this.apiMuseum
      .getArtworksFromBackEnd()
      .subscribe((res: Array<Artworks>) => {
        this.artArray = res;
        console.log("GetArtworks: " + this.artArray);
      });
  }

  //ELEGIR Y CARGAR ARCHIVOS MULTIMEDIA

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

  //Una vez el usuario escoge Media, este método la carga en la pantalla.
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
