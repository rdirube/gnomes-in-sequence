import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  EventEmitter,
  ViewChild,
  Output
} from '@angular/core';
import {GnomeSceneStatus, GnomesNivelation} from '../../models/types';
import {
  AppInfoOxService,
  HintService,
  SoundOxService
} from 'micro-lesson-core';

import {GnomeInfo, GnomeScene, StepsTutorial, GnomesPosition} from '../../models/types';

import {SurpriseAnimationInfo} from '../../models/types';

import {GnomesChallengeService} from 'src/app/shared/services/gnomes-challenge.service';
import anime from 'animejs';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {OxTextInfo, ScreenTypeOx, anyElement, shuffle, lastNElementsOfArray} from 'ox-types';
import {GnomeAnswerService} from 'src/app/shared/services/gnome-answer.service';
import {timer} from 'rxjs';
import {GnomeComponent} from '../gnome/gnome.component';
import {PreloaderOxService} from 'ox-core';
import {TextComponent} from 'typography-ox';

// import { threadId } from 'worker_threads';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})


export class TutorialComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {
  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;
  @ViewChild('tutorialText') tutorialText: TextComponent;

  selectTrigger: EventEmitter<any> = new EventEmitter();
  sequenceEmitter: EventEmitter<number> = new EventEmitter();


  currentStatus!: GnomeSceneStatus;
  public gnomesTutorial: GnomeInfo[] = [];
  public allGnomes: GnomeInfo[] = [];
  public sceneSvg: string;
  public fourthStepActivate = false;
  public surpriseInfo: SurpriseAnimationInfo;
  public sequence: GnomeInfo[] = [];
  public currentScenePositions: GnomesPosition[] = [];
  public info:
    {
      gnomes: GnomeInfo[],
      scenes: GnomeScene[]
    };
  public currentScene: GnomeScene;
  public gnomesTutorialText = new OxTextInfo();
  public tutorialComplete = new OxTextInfo();
  public sequenceCounter: number;
  public stepTutorial: number;
  public currentGnomeToSelect: GnomeInfo;
  public gnomesUsedSecuence: number[] = [];
  public stepArray: number[] = [1, 2, 3, 4];
  public isTutorialComplete: boolean;
  public saltarTutorialText = 'Saltar Tutorial';
  public playNowButtomText = 'Jugar Ahora';
  public repeatTutorialButtomText = 'Repetir Tutorial';
  public middleStepsArray: number[] = this.stepArray.filter((z, i) => i < this.stepArray.length - 1 && i > 0);
  public stepsTitles: StepsTutorial[] = [{
    title: '??Buenas! ??Te damos la bienvenida!'
  }, {
    title: 'Haz CLICK sobre el gnomo que cant??',
  }, {
    title: 'Repite la secuencia',
  }, {
    title: 'Intenta hacer la secuencia lo mas larga posible!',
  }
  ];
  public buttonClass: string[] = ['complete-buttom', 'saltar-tutorial-button'];

  @Output() tutorialEnd = new EventEmitter<{ completed: boolean }>();
  public exerciseConfig: GnomesNivelation;


  constructor(private challengeService: GnomesChallengeService,
              private answerService: GnomeAnswerService, private hintService: HintService,
              private soundService: SoundOxService,
              private preLoaderServide: PreloaderOxService,
              private appService: AppInfoOxService) {
    super();
    this.info = JSON.parse(this.preLoaderServide.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
    this.exerciseConfig = this.appService.microLessonInfo.creatorInfo.microLessonGameInfo.properties;
    const auxScene = anyElement(this.exerciseConfig.possibleScenes);
    this.currentScene = this.sceneDraft(this.info.scenes.find(z => auxScene.includes(z.name)));
    this.setScene();
    // this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)), z => {
    //
    // });

    this.addSubscription(this.selectTrigger, x => {
      if (this.sequence.length > 0) {
        this.gnomeToSelect();
      } else if (this.stepTutorial >= this.middleStepsArray[0] &&
        this.stepTutorial <= this.middleStepsArray[this.middleStepsArray.length - 1]) {
        const middleSequencePivotTextNumber = this.stepTutorial === this.middleStepsArray[0] ? 2 : 3;
        this.textChangeAnimation(600, middleSequencePivotTextNumber);
        this.addSubscription(timer(600), z => {
          this.middleSecuences();
        });
      } else {
        this.addSubscription(timer(1200), z => {
          this.gnomesTutorialText.originalText = '';
          this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
          this.isTutorialComplete = true;
        });
      }
    });


    this.addSubscription(this.sequenceEmitter, z => {
      if (this.sequence.length < z) {
        this.currentStatus = 'ver';
        this.addSubscription(timer(1200), cc => {
          this.sequenceMethod(z);
        });
      } else {
        this.addSubscription(timer(1200), ss => {
          this.selectTrigger.emit();
        });
      }
    });
    this.gnomesTutorialText.color = 'white';
    this.gnomesTutorialText.originalText = '';
    this.gnomesTutorialText.font = 'dinnRegular';
    this.gnomesTutorialText.fontSize = '4.5vh';
    this.gnomesTutorialText.ignoreLowerCase = true;
    this.tutorialComplete.color = 'white';
    this.tutorialComplete.originalText = 'Tutorial completado ??A jugar!';
    this.tutorialComplete.font = 'dinnRegular';
    this.tutorialComplete.fontSize = '6vh';
  }


  private setScene(): void {
    this.sceneSvg = `gnome-game/svg/Fondos/${this.currentScene.name}.svg`;
    this.currentScenePositions = this.currentScene.positions.filter(z =>
      parseInt(z.y, 10) < 45
    );
    this.allGnomes = this.info.gnomes.map(gnome => {
      return {color: gnome.color, sound: gnome.sound, reference: gnome.reference, selectAvaible: false};
    });
    this.gnomesPerScene();
    this.gnomesSingingPerScene();
    this.surprisesInScene(this.info.scenes.indexOf(this.currentScene));
  }


  sceneDraft(gnomeScene: GnomeScene): GnomeScene {
    if (gnomeScene === this.info.scenes[9]) {
      return this.info.scenes[10];
    } else {
      return gnomeScene;
    }
  }


  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.startTutorialMethod();
  }


  gnomesPerScene(): any {
    const allGnomesShuffle = shuffle(this.allGnomes);
    this.currentScenePositions.forEach((z, i) => {
      this.gnomesTutorial.push(allGnomesShuffle[i]);
    });
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


  gnomesSingingPerScene(): void {
    // const gnomeIds = this.gnomesTutorial.map((z, i) => i);

    for (let i = 0; i < 3; i++) {
      // this.gnomesUsedSecuence.push(anyElement(gnomeIds));
      this.gnomesUsedSecuence.push(anyElement(this.getValidGnomeIds(2, this.gnomesUsedSecuence, this.gnomesTutorial)));
    }
  }


  sequenceMethod(sequenceLegth: number): void {
    const indexToSelect = this.gnomesUsedSecuence[this.sequenceCounter];
    this.sequence.push(this.gnomesTutorial[this.gnomesUsedSecuence[this.sequenceCounter]]);
    this.gnomeComponents.toArray()[indexToSelect].playAudio();
    this.sequenceCounter++;
    this.sequenceEmitter.emit(sequenceLegth);
  }


  gnomeToSelect(): void {
    this.currentStatus = 'jugar';
    this.currentGnomeToSelect = this.sequence[0];
  }


  middleSecuences(): void {
    this.sequenceEmitter.emit(this.stepTutorial);
    this.sequenceCounter = 0;
    this.stepTutorial++;
  }


  sequenceAnswer(i): void {
    // const indexToSelect = this.gnomesTutorial.indexOf(this.sequence[0])
    if (this.gnomesTutorial[i] === this.currentGnomeToSelect) {
      this.gnomeComponents.toArray()[i].playAudio();
      this.sequence.shift();
      this.currentGnomeToSelect = this.sequence[0];
      this.selectTrigger.emit();
    } else {
      this.soundService.playCantClickSound(ScreenTypeOx.Game);
    }
  }

  onTutorialEndTrue(): void {
    this.onTutorialEnd(true);
  }


  startTutorialMethod(): void {
    this.gnomesTutorialText.originalText = this.stepsTitles[0].title;
    this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
    this.isTutorialComplete = false;
    this.currentStatus = 'ver';
    this.stepTutorial = 1;
    this.sequenceCounter = 0;
    this.addSubscription(timer(2700), sadas => {
      this.sequenceMethod(0);
      this.stepTutorial++;
      this.textChangeAnimation(600, 1);
    });
  }


  textChangeAnimation(duration: number, step: number): void {
    const tl = anime.timeline({
      targets: '.tutorial-text',
      easing: 'easeInOutExpo'
    });
    tl.add({
      translateY: {
        value: '8vh',
        duration
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
          duration
        }
      });
  }


  textChanger(step: number, duration: number): void {
    this.addSubscription(timer(duration), z => {
      this.gnomesTutorialText.originalText = this.stepsTitles[step].title;
      this.tutorialText.setOxTextInfo = this.gnomesTutorialText;
    });

  }


  onSkipTutorial(): void {
    this.onTutorialEnd(false);
  }

  onTutorialEnd(completed: boolean): void {
    this.tutorialEnd.emit({completed});
  }
}



