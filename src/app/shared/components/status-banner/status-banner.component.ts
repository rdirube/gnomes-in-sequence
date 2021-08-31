import {Component, HostListener, Input, OnInit} from '@angular/core';
import anime from 'animejs';
import {GnomeSceneStatus} from '../../../gnomes-game/models/types';

@Component({
  selector: 'app-status-banner',
  templateUrl: './status-banner.component.html',
  styleUrls: ['./status-banner.component.scss']
})
export class StatusBannerComponent implements OnInit {
  currentBannerSvg: string;
  currentBannerText: string;

  @Input('currentStatus')
  set status(s: GnomeSceneStatus) {
    this.changeStatus(s);
  }

  private _currentStatus: GnomeSceneStatus;

  constructor() {
  }

  ngOnInit(): void {
    this.currentBannerSvg = 'gnome-game/svg/jugar.svg';
    this.currentBannerText = 'Jugar';
  }

  changeStatus(newStatus: GnomeSceneStatus): void {
    if (newStatus !== this._currentStatus) {
      this._currentStatus = newStatus;
      const duration = 350;
      const watching = this._currentStatus === 'ver';
      anime({
        targets: '.banner',
        rotateZ: 180,
        duration,
        easing: 'linear',
        complete: () => {
          this.currentBannerSvg = watching ? 'gnome-game/svg/ver.svg' : 'gnome-game/svg/jugar.svg';
          this.currentBannerText = watching ? 'Ver' : 'Jugar';
          anime({
            targets: '.banner',
            easing: 'linear',
            rotateZ: watching ? 360 : 0,
            duration,
          });
        }
      });
    }
  }

}
