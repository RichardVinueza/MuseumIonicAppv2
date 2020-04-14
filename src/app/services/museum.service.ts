import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http'

export const localhost = "http://192.168.0.16:8080";

export class Exhibitions {
  id: number;
  name: string;
  openingDate: string;
  closingDate: string;
  location: string;
}

export class Artworks {
  id: number;
  name: string;
  author: string;
  country: string;
  media: [MediApi];
}

export class MediApi {
  id: number;
  displayName: string;
  fileName: string;
  fileType: string;
  extension: string;
}

export class Beacons {
  id: number;
  mac: string;
  arworkId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MuseumService {

  constructor(private http: HttpClient, public sanatizer: DomSanitizer) { }

  getExhibitionsFromBackEnd() {
    return this.http.get(localhost + "/exhibitions");
  }

  getArtworksFromBackEnd(){
    return this.http.get(localhost + "/artworks");
  }

  getMediaFromBackEnd(){
    return this.http.get(localhost + "/media");
  }

  getBeaconsFromBackEnd(){
    return this.http.get(localhost + "/beacons");
  }
}
