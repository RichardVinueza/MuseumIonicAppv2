import { Component } from '@angular/core';
import { MuseumService, localhost, Exhibitions, Artworks } from '../services/museum.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  locahost = localhost;

  exhibitArray: Array<Exhibitions> = [];
  exhibit: Exhibitions;

  artArray: Array<Artworks> = [];
  artArrayShow = new Array<Artworks>();
  art: Artworks;
  imgArtwork: any;

  typeFileChoices: [string];

  constructor(
    private apiMuseum: MuseumService
  ) { }

  ionViewDidEnter() {
    this.getExhibitions();
    this.getArtworks();
  }

  getExhibitions() {
    this.apiMuseum.getExhibitionsFromBackEnd().subscribe((res: Array<Exhibitions>) => {
      this.exhibitArray = res;
    })
  }

  getArtworks() {
    this.apiMuseum.getArtworksFromBackEnd().subscribe((res: Array<Artworks>) => {
      this.artArray = res;
    })
  }

  changeTypeFile(event) {
    let fileChoice: [string] = event.detail.value;
    if (fileChoice == []) {
      this.typeFileChoices = ["image"];
      this.artArrayShow = this.artArray;
    } else {
      this.loadArtworkShow(fileChoice);
    }
  }

  loadArtworkShow(fileChoice: [string]) {
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
