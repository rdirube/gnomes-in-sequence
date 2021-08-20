import {Component, Input, OnInit} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {SoundOxService} from 'micro-lesson-core';
import {ScreenTypeOx} from 'ox-types';

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

  setSvg(svg: string): void {
    this.currentSvg = 'gnome-game/svg/gnomes/' + this.gnomeInfo.color + '/' + this.gnomeInfo.color + '_' + svg + '.svg';
  }

  playAudio(): void {
    this.setSvg('cantando');
    this.soundService.playSoundEffect('gnome-game/sounds/' + this.gnomeInfo.sound, ScreenTypeOx.Game, false,
      true, () => {
        this.setSvg('normal');
      });
    console.log('playAudio');
  }

  stopAudio(): void {
    console.log('stopAudio');
  }
}
