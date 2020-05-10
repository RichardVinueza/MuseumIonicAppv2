import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

export const ipAddress = "http://192.168.0.17:8080";

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
  media: [MediaApi];
}

export class MediaApi {
  id: number;
  displayName: string;
  fileName: string;
  fileType: string;
  extension: string;
}

export class Beacons {
  id: number;
  mac: string;
  artworkId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MuseumService {

  constructor(private http: HttpClient, public sanatizer: DomSanitizer) { }

  getExhibitionsFromBackEnd() {
    return this.http.get(ipAddress + "/exhibitions");
  }

  getArtworksFromBackEnd() {
    return this.http.get(ipAddress + "/artworks");
  }

  getMediaFromBackEnd() {
    return this.http.get(ipAddress + "/medias");
  }

  getBeaconsFromBackEnd() {
    return this.http.get(ipAddress + "/beacons");
  }
}
