import {Component, Input, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {SoundOxService} from 'micro-lesson-core';
import {ScreenTypeOx} from 'ox-types';
import {getGnomeAudio, getGnomeImage} from '../../../shared/functions/gnomes-functions';

@Component({
  selector: 'app-gnome',
  templateUrl: './gnome.component.html',
  styleUrls: ['./gnome.component.scss']
})
export class GnomeComponent implements OnInit {

  @Input() gnomeInfo: GnomeInfo;
  interactable: boolean;

  public currentSvg: string;

  constructor(private soundService: SoundOxService) {
  }

  ngOnInit(): void {
    this.setSvg('normal');
  }

  setSvg(svg: 'normal' | 'festejo' | 'cantando'): void {
    this.currentSvg = getGnomeImage(this.gnomeInfo.color, svg);
    // this.currentSvg = 'gnome-game/svg/gnomes/' + this.gnomeInfo.color + '/' + this.gnomeInfo.color + '_' + svg + '.svg';
  }

  playAudio(extraCallBak = () => {}): void {
    this.setSvg('cantando');
    this.soundService.playSoundEffect(getGnomeAudio(this.gnomeInfo.sound), ScreenTypeOx.Game, false,
      true, () => {
        this.setSvg('normal');
        extraCallBak();
      });
    console.log('playAudio');
  }

  stopAudio(): void {
    console.log('stopAudio');
  }
}
