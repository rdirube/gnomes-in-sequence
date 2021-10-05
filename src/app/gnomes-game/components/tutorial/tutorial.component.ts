import { AfterViewInit, Component, Input, OnInit, ViewChildren, QueryList, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { GnomeSceneStatus, GnomesExercise } from '../../models/types';
import {
  FeedbackOxService,
  GameActionsService, HintService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService
} from 'micro-lesson-core';

import { GnomeInfo, GnomeScene, StepsTutorial, gnomesPosition } from '../../models/types';

import { SurpriseAnimationInfo } from '../../models/types';

import { GnomesChallengeService } from 'src/app/shared/services/gnomes-challenge.service';
import anime from 'animejs'
import { EasterEggAnimationComponent, SubscriberOxDirective } from 'micro-lesson-components';
import { AnswerMetric, OxTextInfo, RestartGameOxBridge } from 'ox-types';
import { GnomeAnswerService } from 'src/app/shared/services/gnome-answer.service';
import { Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GnomeComponent } from '../gnome/gnome.component';
import { anyElement, PreloaderOxService, shuffle, lastNElementsOfArray, replaceAll } from 'ox-core';
import { Typographies, TextComponent } from 'typography-ox';
import { $ } from 'protractor';


// import { threadId } from 'worker_threads';



@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {
  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;
  @ViewChild('tutorialText') tutorialText: TextComponent;

  thirdSecuence: EventEmitter<any> = new EventEmitter();
  secondSecuence: EventEmitter<any> = new EventEmitter();
  selectTrigger: EventEmitter<any> = new EventEmitter();
  sequenceEmitter: EventEmitter<number> = new EventEmitter();


  currentStatus: GnomeSceneStatus = 'ver';
  public gnomesTutorial: GnomeInfo[] = [];
  public allGnomes: GnomeInfo[] = [];
  public sceneSvg: string;
  public surpriseInfo: SurpriseAnimationInfo;
  public sequence: GnomeInfo[] = [];
  public currentScenePositions: gnomesPosition[] = [];
  public info:
    {
      gnomes: GnomeInfo[],
      scenes: GnomeScene[]
    };
  public currentScene: GnomeScene;
  public gnomesTutorialText = new OxTextInfo;
  public tutorialComplete = new OxTextInfo;
  public tutorialTextContent: string;
  public sequenceCounter: number;
  public stepTutorial: number;
  public currentGnomeToSelect: GnomeInfo;
  public fourthWatchVar: boolean;
  public gnomesUsedSecuence: number[] = [];
  public stepArray: number[] = [1, 2, 3, 4];
  public isTutorialComplete: boolean;
  public middleStepsArray: number[] = this.stepArray.filter((z, i) => i < this.stepArray.length - 1 && i > 0);
  public stepsTitles: StepsTutorial[] = [{
    title: "¡Bienvenido! Presta atención a los gnomos"
  }, {
    title: "Haz click sobre el gnomo iluminado",
  }, {
    title: "Repite la siguiente secuencia",
  }, {
    title: "¡Intenta hacer la secuencia lo mas larga posible!",
  }, {
    title: "¡En caso de no clickear ningun gnomo antes del tiempo limite, pierdes! (barra superior)",
  }
  ]
  public textEffectActivation: boolean = false;



  constructor(private challengeService: GnomesChallengeService, private answerService: GnomeAnswerService, private hintService: HintService, private preLoaderServide: PreloaderOxService) {
    super()
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)), z => {
      this.info = JSON.parse(this.preLoaderServide.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
      this.currentScene = this.info.scenes[7]
      this.setScene();
    })



    this.addSubscription(this.selectTrigger, x => {
      if (this.sequence.length > 0) {
        this.gnomeToSelect();
      }
      else if (this.stepTutorial >= this.middleStepsArray[0] &&
        this.stepTutorial <= this.middleStepsArray[this.middleStepsArray.length - 1]) {
        let middleSequencePivotTextNumber = this.stepTutorial === this.middleStepsArray[0] ? 2 : 3;
        this.textChangeAnimation(600, middleSequencePivotTextNumber);
        timer(600).subscribe(z => {
          this.middleSecuences();
        })

      }
      else if (this.stepTutorial === this.stepArray[this.stepArray.length - 1]) {
        this.textChangeAnimation(500, 4);
        timer(600).subscribe(z => {
          this.limitTimeStep();
        })
      } else {
        timer(8050).subscribe(z => {
          this.gnomesTutorialText.originalText = "";
          this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
          this.isTutorialComplete = true
        });
      }
    })


    this.addSubscription(this.sequenceEmitter, z => {
      if (this.sequence.length < z) {
        this.currentStatus = 'ver';
        timer(1200).subscribe(cc => {
          this.sequenceMethod(z);
        })
      } else {
        timer(1200).subscribe(ss => {
          this.selectTrigger.emit();
        })
      }
    })
    this.gnomesTutorialText.color = "white";
    this.gnomesTutorialText.originalText = "";
    this.gnomesTutorialText.font = "dinnRegular";
    this.gnomesTutorialText.fontSize = "1.5rem";
    this.tutorialComplete.color = "white";
    this.tutorialComplete.originalText = "Tutorial completo ¡A jugar!";
    this.tutorialComplete.font = "dinnRegular";
    this.tutorialComplete.fontSize = "2rem";
  }



  private setScene() {
    this.sceneSvg = `gnome-game/svg/Fondos/${this.currentScene.name}.svg`;
    this.currentScenePositions = this.currentScene.positions.filter(z =>
      parseInt(z.y, 10) < 45
    )
    this.allGnomes = this.info.gnomes.map(gnome => {
      return { color: gnome.color, sound: gnome.sound, reference: gnome.reference, selectAvaible: false };
    });
    this.gnomesPerScene();
    this.gnomesSingingPerScene();
    this.surprisesInScene(this.info.scenes.indexOf(this.currentScene));
  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.initialTutorialMethod();
  }



  gnomesPerScene(): any {
    const allGnomesShuffle = shuffle(this.allGnomes);
    this.currentScenePositions.forEach((z, i) => {
      this.gnomesTutorial.push(allGnomesShuffle[i])
    })
  }



  surprisesInScene(indexSceneLevel: number): void {
    this.surpriseInfo = this.info.scenes[indexSceneLevel].surpriseAnimationInfo;
  }



  getValidGnomeIds(maxConsecutive: number, sequenceIds: number[], exerciseGnomes: GnomeInfo[]): number[] {
    const lastNGnomesIndex = lastNElementsOfArray(sequenceIds, maxConsecutive);
    const gnomeIds = exerciseGnomes.map((z, i) => i);
    const lastNGnomesAreEqual = lastNGnomesIndex.every(z => z === lastNGnomesIndex[0]) ? lastNGnomesIndex[0] : null;
    return gnomeIds.filter(z => z !== lastNGnomesAreEqual);
  }


  gnomesSingingPerScene(): any {
    for (let i = 0; i < 3; i++) {
      this.gnomesUsedSecuence.push(anyElement(this.getValidGnomeIds(2, this.gnomesUsedSecuence, this.gnomesTutorial)));
    }
  }


  sequenceMethod(sequenceLegth: number) {
    const indexToSelect = this.gnomesUsedSecuence[this.sequenceCounter];
    this.sequence.push(this.gnomesTutorial[this.gnomesUsedSecuence[this.sequenceCounter]]);
    this.gnomeComponents.toArray()[indexToSelect].playAudio();
    this.sequenceCounter++;
    this.sequenceEmitter.emit(sequenceLegth);
  }



  limitTimeStep() {
    this.fourthWatchVar = true;
    this.stepTutorial++;
    this.selectTrigger.emit();
  }



  gnomeToSelect() {
    this.currentStatus = 'jugar';
    this.currentGnomeToSelect = this.sequence[0]
  }



  middleSecuences() {
    this.sequenceEmitter.emit(this.stepTutorial);
    this.textEffectActivation != this.textEffectActivation;
    this.sequenceCounter = 0;
    this.stepTutorial++;
  }



  sequenceAnswer(i) {
    // const indexToSelect = this.gnomesTutorial.indexOf(this.sequence[0])
    if (this.gnomesTutorial[i] === this.currentGnomeToSelect) {
      this.gnomeComponents.toArray()[i].playAudio();
      this.sequence.shift();
      this.currentGnomeToSelect = this.sequence[0];
      this.selectTrigger.emit();
    }
  }


  repeatTutorialMethod() {
    this.initialTutorialMethod();
  }



  initialTutorialMethod() {
    this.gnomesTutorialText.originalText = this.stepsTitles[0].title;
    this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
    this.isTutorialComplete = false;
    this.fourthWatchVar = false;
    this.currentStatus = 'ver';
    this.stepTutorial = 1;
    this.sequenceCounter = 0;
    timer(2000).subscribe(sadas => {
      this.sequenceMethod(0);
      this.stepTutorial++;
      this.textChangeAnimation(600, 1);
    })
  }



  textChangeAnimation(duration: number, step: number) {
    const tl = anime.timeline({
      targets: '.tutorial-text',
      easing: 'easeInOutExpo'
    });
    tl.add({
      translateY: {
        value: '8vh',
        duration: duration
      }
    }).add({
      translateY: {
        value: '-8vh',
        duration: 1,
        complete: this.textChanger(step, duration)
      }
    })
      .add({
        translateY: {
          value: '0vh',
          duration: duration
        }
      })
  }




  textChanger(step: number, duration: number) {
    timer(duration).subscribe(z => {
      this.gnomesTutorialText.originalText = this.stepsTitles[step].title;
      this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
    })

  }




}



