import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GnomeInfo, GnomeInfoTutorial } from '../../models/types';
import { SoundOxService } from 'micro-lesson-core';
import { ScreenTypeOx } from 'ox-types';
import { getGnomeAudio, getGnomeImage } from '../../../shared/functions/gnomes-functions';
import { LoadedSvgComponent } from 'micro-lesson-components';


@Component({
  selector: 'app-gnome',
  templateUrl: './gnome.component.html',
  styleUrls: ['./gnome.component.scss']
})
export class GnomeComponent implements OnInit {

  @Input() gnomeInfo: GnomeInfo;
  @Input() gnomeInfoTutorial: GnomeInfoTutorial;
  interactable: boolean;


  public currentSvg: string;
  public selectAvaiableTutorial: boolean = false;


  constructor(private soundService: SoundOxService) {
  }


  ngOnInit(): void {
    this.setSvg('normal');
  }

  setSvg(svg: 'normal' | 'festejo' | 'cantando'): void {
    this.currentSvg = getGnomeImage(this.gnomeInfo.reference, svg);
    console.log('Setting svg', svg, this.currentSvg);
    // this.currentSvg = 'gnome-game/svg/gnomes/' + this.gnomeInfo.color + '/' + this.gnomeInfo.color + '_' + svg + '.svg';
  }

  playAudio(extraCallBak = () => { }): void {
    this.setSvg('cantando');
    this.soundService.playSoundEffect(getGnomeAudio(this.gnomeInfo.sound), ScreenTypeOx.Game, false,
      true, () => {
        this.setSvg('normal');
        extraCallBak();
      });
    console.log(this.currentSvg);
  }


  stopAudio(): void {
    console.log('stopAudio');
  }



}
