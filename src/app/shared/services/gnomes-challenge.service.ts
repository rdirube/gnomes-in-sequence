import { Injectable } from '@angular/core';
import {PreloaderOxService} from 'ox-core';

@Injectable({
  providedIn: 'root'
})
export class GnomesChallengeService {
  public info: any;

  constructor(private preloaderService: PreloaderOxService) {
  }

  public assignInfoValues(): void {
    this.info = JSON.parse(this.preloaderService.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
    console.log(this.info);
  }
}
