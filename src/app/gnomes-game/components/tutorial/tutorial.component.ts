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
import anime from 'animejs'
import { SubscriberOxDirective } from 'micro-lesson-components';
import { AnswerMetric, OxTextInfo } from 'ox-types';
import { GnomeAnswerService } from 'src/app/shared/services/gnome-answer.service';
import { Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GnomeComponent } from '../gnome/gnome.component';
import { PreloaderOxService } from 'ox-core';
import { Typographies } from 'typography-ox';
// import { threadId } from 'worker_threads';



@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {
  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;

  thirdSecuence: EventEmitter<any> = new EventEmitter();
  secondSecuence: EventEmitter<any> = new EventEmitter();
  selectTrigger: EventEmitter<any> = new EventEmitter()

  currentStatus: GnomeSceneStatus = 'ver';
  public gnomesTutorial: GnomeInfoTutorial[] = [];
  public allGnomes: GnomeInfoTutorial[] = [];
  public sceneSvg: string;
  public surpriseInfo: SurpriseAnimationInfo;
  public sequence: GnomeInfoTutorial[] = [];
  public currentScenePositions = [];
  public sequenceSubscription: Subscription;
  public info: 
  {
    gnomes: GnomeInfoTutorial[],
    scenes: GnomeScene[]
  };
  public firstStep: boolean = true;
  public gnomeClass: any[];
  public gnomesTutorialText: OxTextInfo[];
  public tutorialTextContent: string;
  public thirdSecuenceVar:boolean = true;
  public sequenceCounter: number = 0;
  public stepTutorial:number = 2;
  public fourthWatchVar:boolean = false;



  constructor(private challengeService: GnomesChallengeService, private answerService: GnomeAnswerService, private hintService: HintService, private preLoaderServide: PreloaderOxService) {
    super()
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)), z => {
      this.info = JSON.parse(this.preLoaderServide.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
      this.sceneSvg = 'gnome-game/svg/Fondos/jardin-chimenea-2.svg';
      this.allGnomes = this.info.gnomes.map(gnome => {
        return { color: gnome.color, sound: gnome.sound, reference: gnome.reference, selectAvaible: false };
      });
      this.gnomesTutorial = [this.allGnomes[0], this.allGnomes[1]];
      this.currentScenePositions = this.info.scenes[3].positions;
    })
    this.addSubscription(this.selectTrigger, x => {
      if (this.sequence.length > 0) {
        this.gnomeToSelect();
      }
      else if (this.stepTutorial === 2) {
        this.stepTutorial++;
        this.secondSecuence.emit();
        
      }
      else if(this.stepTutorial === 3){
        this.thirdSecuence.emit();
        this.stepTutorial++;
        console.log(this.stepTutorial)
      } else if (this.stepTutorial === 4) {
           this.secuenceMethod4();
           console.log(this.fourthWatchVar)
      }
    })
    this.addSubscription(this.secondSecuence, z => {
      if(this.sequence.length < 2) {
       setTimeout(() => {
         this.sequenceMethod2()
       }, 1000);
      } else {
        setTimeout(() => {
          this.selectTrigger.emit();
        }, 1600);
      }
    })
    this.addSubscription(this.thirdSecuence, z => {
      if (this.sequence.length < 3) {
        setTimeout(() => {
          this.sequenceMethod3();
        }, 1000);
      } else {
        setTimeout(() => {
          this.selectTrigger.emit()
        }, 1600);
      }
    })


  }
  // [{"x":"8.5vh","y":"11vh"},{"x":"8vh","y":"53vh"},{"x":"98vh","y":"11vh"},{"x":"98vh","y":"53vh"}]



  ngOnInit(): void {
  }



  ngAfterViewInit(): void {
    this.sequenceMethod1();
    this.gnomeToSelect();
  }



  sequenceMethod1() {
    this.sequence.push(this.gnomesTutorial[0]);
    this.gnomeComponents.toArray()[0].playAudioTutorial();
  }



  sequenceMethod2() {
    if (this.sequenceCounter < 2) {
      this.sequence.push(this.gnomesTutorial[this.sequenceCounter]);
      const indexToSelect = this.gnomesTutorial.indexOf(this.sequence[this.sequenceCounter])
      this.gnomeComponents.toArray()[indexToSelect].playAudioTutorial();
      this.sequenceCounter++;
    }
    this.secondSecuence.emit();

    // if (this.secondVarSeq) {
    //   this.sequence.push(this.gnomesTutorial[0]);
    //   this.gnomeComponents.toArray()[0].playAudioTutorial();
    //   this.secondVarSeq = false;
    // } else {
    //   this.sequence.push(this.gnomesTutorial[1]);
    //   this.gnomeComponents.toArray()[1].playAudioTutorial();
    // }
  }




  sequenceMethod3() {
      this.sequenceCounter = 0;
    setTimeout(() => {
      if (this.thirdSecuenceVar) {
        this.sequence.push(this.gnomesTutorial[0]);
        this.gnomeComponents.toArray()[0].playAudioTutorial();
        this.thirdSecuenceVar = !this.thirdSecuenceVar;
      } else {
        this.sequence.push(this.gnomesTutorial[1]);
        this.gnomeComponents.toArray()[1].playAudioTutorial();
      }
      this.thirdSecuence.emit()
   }, 700);
  }


  secuenceMethod4 () {
    this.fourthWatchVar = true;
  }



  gnomeToSelect() {
    const indexToSelect = this.gnomesTutorial.indexOf(this.sequence[0])
    this.gnomesTutorial[indexToSelect].selectAvaible = true;
  }



  sequenceAnswer(i) {
    // const indexToSelect = this.gnomesTutorial.indexOf(this.sequence[0])
    if (this.gnomeComponents.toArray()[i].gnomeInfoTutorial.selectAvaible === true) {
      this.gnomeComponents.toArray()[i].gnomeInfoTutorial.selectAvaible = false;
      this.gnomeComponents.toArray()[i].playAudioTutorial();
      this.sequence.shift();
      this.selectTrigger.emit();
    }
  }




}









