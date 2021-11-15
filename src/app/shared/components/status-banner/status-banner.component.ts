import {Component, HostListener, Input, OnInit} from '@angular/core';
import anime from 'animejs';
import {GnomeSceneStatus} from '../../../gnomes-game/models/types';
import {TranslocoService} from '@ngneat/transloco';

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
  currentTextId: string;

  constructor(private transloco: TranslocoService) {
  }

  ngOnInit(): void {
    this.currentBannerSvg = 'gnome-game/svg/jugar.svg';
    this.currentTextId = 'play';
    this.currentBannerText = 'Jugar';
    // console.log('this.transloco', this.transloco);
    // console.log('this.transloco', this.transloco.translate('watch'));
    // console.log(this.transloco.getTranslation().get('watch'));
  }

  changeStatus(newStatus: GnomeSceneStatus): void {
    if (newStatus !== this._currentStatus) {
      this._currentStatus = newStatus;
      const duration = 200; // is multiplicated by 2
      const watching = this._currentStatus === 'ver';
      anime({
        targets: '.banner',
        rotateZ: 180,
        duration,
        easing: 'linear',
        complete: () => {
          this.currentBannerSvg = watching ? 'gnome-game/svg/ver.svg' : 'gnome-game/svg/jugar.svg';
          this.currentBannerText = watching ? 'Ver' : 'Jugar';
          // this.currentTextId = watching ? 'watch' : 'play';
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
