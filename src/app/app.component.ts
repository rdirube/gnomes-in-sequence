import {Component, ElementRef} from '@angular/core';
import {CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ResourceFinalStateOxBridge, ScreenTypeOx} from 'ox-types';
import {environment} from '../environments/environment';
import {GnomesChallengeService} from './shared/services/gnomes-challenge.service';
import {
  AppInfoOxService, BaseMicroLessonApp,
  EndGameService,
  GameActionsService,
  InWumboxService,
  LevelService,
  MicroLessonCommunicationService, MicroLessonMetricsService,
  ProgressService, ResourceStateService, SoundOxService
} from 'micro-lesson-core';
import {TranslocoService} from '@ngneat/transloco';
import {HttpClient} from '@angular/common/http';
import {PostMessageBridgeFactory} from 'ngox-post-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseMicroLessonApp {
  title = 'gnomes-in-sequence';

  constructor(preloader: PreloaderOxService, translocoService: TranslocoService, wumboxService: InWumboxService,
              communicationOxService: CommunicationOxService, microLessonCommunicationService: MicroLessonCommunicationService<any>,
              progressService: ProgressService, elementRef: ElementRef, gameActions: GameActionsService<any>,
              endGame: EndGameService, i18nService: I18nService, levelService: LevelService, http: HttpClient,
              challenge: GnomesChallengeService, appInfo: AppInfoOxService,
              microLessonMetrics: MicroLessonMetricsService<any>, // Todo
              resourceStateService: ResourceStateService,
              sound: SoundOxService, bridgeFactory: PostMessageBridgeFactory) {
    super(preloader, translocoService, wumboxService, communicationOxService, microLessonCommunicationService,
      progressService, elementRef, gameActions, endGame,
      i18nService, levelService, http, challenge, appInfo, microLessonMetrics, sound, bridgeFactory);
    gameActions.microLessonCompleted.subscribe(__ => {
      if (resourceStateService.currentState?.value) {
        microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
      }
    });
  }


  protected getGameResourcesToLoad(): ResourceOx[] {
    const svg = ['executive-functions/svg/buttons/Home.svg',
      'executive-functions/svg/buttons/Hint.svg',
      'gnome-game/svg/saltear.svg',
      'gnome-game/svg/jugar.svg', 'gnome-game/svg/ver.svg'];
    ['amarillo', 'celeste', 'azul', 'naranja', 'rojo', 'verde', 'violeta'].forEach(z => {
      ['_cantando.svg', '_festejo.svg', '_normal.svg'].forEach(x => {
        svg.push('gnome-game/svg/gnomes/' + z + '/' + z + x);
      });
    });
    ['alacena-5.svg', 'biblioteca-6.svg', 'baño-5.svg', 'chimenea-4.svg',
      'chimenea-2.svg',
      'escaleras-6.svg', 'establo-4.svg'].forEach(z => {
      svg.push('gnome-game/svg/Fondos/' + z);
    });
    return svg.map(x => new ResourceOx(x, ResourceType.Svg,
      [ScreenTypeOx.Game], true)).concat(
      ['bubble01.mp3', 'bubble02.mp3'].map(x => new ResourceOx('sounds/' + x, ResourceType.Audio,
        [ScreenTypeOx.Game], false))).concat(
      ['gnome-game/sounds/blueshortFinal.mp3',
        'gnome-game/sounds/greenshortFinal.mp3',
        'gnome-game/sounds/lightblueshortFinal.mp3',
        'gnome-game/sounds/redshortFinal.mp3',
        'gnome-game/sounds/violetshortFinal.mp3',
        'gnome-game/sounds/yellowshortFinal.mp3'].map(x => new ResourceOx(x, ResourceType.Audio,
        [ScreenTypeOx.Game], true)))
      .concat(new ResourceOx('gnome-game/jsons/gnomes-and-scenes-info.json', ResourceType.Json,
        [ScreenTypeOx.Game], true));
  }

  protected getBasePath(): string {
    return environment.basePath;
  }

//   sdasdasa() {
//     this.preloaderService.addResourceToLoad(new ResourceOx(, ResourceType.Svg, [ScreenTypeOx.Game], true));
// ;
//     this.preloaderService.loadAll().subscribe(x => {
//       this.challengeService.assignInfoValues();
//       this.loadded = true;
//     });
//
//   }
}
