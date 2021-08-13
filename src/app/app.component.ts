import {Component} from '@angular/core';
import {PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ScreenTypeOx} from 'ox-types';
import {environment} from '../environments/environment';
import {GnomesChallengeService} from './shared/services/gnomes-challenge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gnomes-in-sequence';
  loadded: boolean;

  constructor(private preloaderService: PreloaderOxService,
              private challengeService: GnomesChallengeService) {
    this.preloaderService.basePath = environment.basePath;
    this.preloaderService.addResourceToLoad(
      new ResourceOx('gnome-game/jsons/gnomes-and-scenes-info.json', ResourceType.Json,
        [ScreenTypeOx.Game], true));
    ['blueshortFinal.mp3',
      'greenshortFinal.mp3',
      'lightblueshortFinal.mp3',
      'redshortFinal.mp3',
      'violetshortFinal.mp3',
      'yellowshortFinal.mp3'].forEach(z => {
      this.preloaderService.addResourceToLoad(new ResourceOx('gnome-game/sounds/' + z, ResourceType.Audio, [ScreenTypeOx.Game], true));
    });
    this.preloaderService.addResourceToLoad(new ResourceOx('gnome-game/svg/Fondos/establo.svg', ResourceType.Svg, [ScreenTypeOx.Game], true));
    ['amarillo', 'celeste', 'azul', 'naranja', 'rojo'].forEach(z => {
      ['_cantando.svg', '_festejo.svg', '_normal.svg'].forEach(x => {
        this.preloaderService.addResourceToLoad(
          new ResourceOx('gnome-game/svg/gnomes/' + z + '/' + z + x, ResourceType.Svg,
            [ScreenTypeOx.Game], true));
      });
    });
    this.preloaderService.loadAll().subscribe(x => {
      this.challengeService.assignInfoValues();
      this.loadded = true;
    });

  }
}
