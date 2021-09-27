import { AfterViewInit, Component, Input, OnInit, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { GnomeSceneStatus, GnomesExercise } from '../../models/types';
import {
  FeedbackOxService,
  GameActionsService, HintService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService
} from 'micro-lesson-core';

import { GnomeInfo, GnomeScene, GnomeInfoTutorial } from '../../models/types';

import { SurpriseAnimationInfo } from '../../models/types';

import { GnomesChallengeService } from 'src/app/shared/services/gnomes-challenge.service';

import { SubscriberOxDirective } from 'micro-lesson-components';
import { AnswerMetric, OxTextInfo } from 'ox-types';
import { GnomeAnswerService } from 'src/app/shared/services/gnome-answer.service';
import { Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GnomeComponent } from '../gnome/gnome.component';
import { PreloaderOxService } from 'ox-core';
import { Typographies } from 'typography-ox';



@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {
  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;

  firstSecuenceTrigger: EventEmitter<any> = new EventEmitter();

  currentStatus: GnomeSceneStatus = 'ver';
  public gnomesTutorial: GnomeInfoTutorial[] = [];
  public allGnomes: GnomeInfoTutorial[] = [];
  public sceneSvg: string;
  public surpriseInfo: SurpriseAnimationInfo;
  public sequence: string[] = [];
  public currentScenePositions = [];
  public sequenceSubscription: Subscription;
  public info: {
    gnomes: GnomeInfoTutorial[],
    scenes: GnomeScene[]
  };
  public firstStep: boolean = true;
  public gnomeClass: any[];
  public gnomesTutorialText: OxTextInfo[];
  public tutorialTextContent: string;

  constructor(private challengeService: GnomesChallengeService, private answerService: GnomeAnswerService, private hintService: HintService, private preLoaderServide: PreloaderOxService) {
    super()
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)), z => {
      this.info = JSON.parse(this.preLoaderServide.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
      this.sceneSvg = 'gnome-game/svg/Fondos/jardin-establo-4.svg';
      this.allGnomes = this.info.gnomes.map(gnome => {
        return { color: gnome.color, sound: gnome.sound, reference: gnome.reference, selectAvaible: false };
      });
      this.gnomesTutorial = [this.allGnomes[0], this.allGnomes[1], this.allGnomes[2], this.allGnomes[3]];
      this.currentScenePositions = this.info.scenes[6].positions;
    })

    this.addSubscription(this.firstSecuenceTrigger, z => {
      this.secondSecuence();
    })

  }
  // [{"x":"8.5vh","y":"11vh"},{"x":"8vh","y":"53vh"},{"x":"98vh","y":"11vh"},{"x":"98vh","y":"53vh"}]



  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.startTutorial();
  }


  startTutorial() {
    setTimeout(() => {
      this.gnomeComponents.toArray()[0].playAudioTutorial();
    }, 1000);
    setTimeout(() => {
      this.gnomesTutorial[0].selectAvaible = true;
    }, 1700);
  }




  secuencialTutorial(i) {
    this.gnomeComponents.toArray()[i].playAudioTutorial();
    this.gnomeComponents.toArray()[i].gnomeInfoTutorial.selectAvaible = false;
    this.firstSecuenceTrigger.emit();
  }



  secondSecuence() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.gnomeComponents.toArray()[i].playAudioTutorial();
        this.sequence.push(this.gnomesTutorial[i].reference)
      }, 1000 * i + 1)  
    }
    
    console.log(this.sequence);
  }

  //   }
  //   setTimeout(() => {
  //   }, 1000);
  //   setTimeout(() => {
  //     this.gnomeComponents.toArray()[2].playAudioTutorial();
  //   }, 2000);
  //   setTimeout(() => {
  //     this.gnomeComponents.toArray()[1].playAudioTutorial();
  //   }, 3000);
  // }


  secondSecuenceSolved(i) {
    this.answerService.addPartialAnswer(i)

  }


}