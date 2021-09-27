import {Component, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GnomeInfo, GnomeSceneStatus, GnomesExercise, SurpriseAnimationInfo} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {filter, take} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
import {TimeToLoseService} from '../../../shared/services/time-to-lose.service';
import {GnomeComponent} from '../gnome/gnome.component';
import {
  FeedbackOxService,
  GameActionsService, HintService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService
} from 'micro-lesson-core';
import {GnomeAnswerService} from '../../../shared/services/gnome-answer.service';
import {
  ExerciseData,
  ExpandedShowable,
  GameAskForScreenChangeBridge,
  ScreenTypeOx,
  WorkingMemoryPart,
  WorkingMemorySchemaData
} from 'ox-types';
import {getGnomeAudio, getGnomeImage} from '../../../shared/functions/gnomes-functions';
import {anyElement, replaceAll, shuffle} from 'ox-core';
import anime from 'animejs';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  @ViewChildren(GnomeComponent) gnomeComponents: QueryList<GnomeComponent>;
  public gnomes: GnomeInfo[] = [];
  public playingSequence: boolean;
  public sequence: number[];
  public sequenceSubscription: Subscription;
  currentStatus: GnomeSceneStatus = 'ver';

  public currentScenePositions = [];
  showCountDown: boolean;
  private interactableGnomes: boolean;
  public sceneSvg: string;
  public surpriseInfo: SurpriseAnimationInfo;

  constructor(private challengeService: GnomesChallengeService,
              private metricsService: MicroLessonMetricsService<GnomesExercise>,
              private hintService: HintService,
              private timeToLose: TimeToLoseService,
              private gameActions: GameActionsService<GnomesExercise>,
              private feedback: FeedbackOxService,
              private microLessonCommunication: MicroLessonCommunicationService<any>,
              private answerService: GnomeAnswerService) {
    super();
    this.hintService.checkValueOnShowNextChallenge = false;
    // this.addSubscription(this.gameActions.microLessonCompleted, z => {
    //   this.showCountDown = undefined;
    // });
    // this.addSubscription(this.gameActions.restartGame, z => {
    // });
    this.addSubscription(this.gameActions.showHint, z => {
      this.answerService.cleanAnswer();
      this.playSequence();
    });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      this.interactableGnomes = false;
      this.timeToLose.stop();
      if (z.correctness === 'correct') {
        timer(1000).subscribe(sadas => {
          this.feedback.endFeedback.emit();
          this.gameActions.showNextChallenge.emit();
        });
      } else {
        timer(1000).subscribe(sadas => {
          this.feedback.endFeedback.emit();
          timer(1000).subscribe(aa => {
            this.gameActions.microLessonCompleted.emit();
            timer(500).subscribe(zzz =>
              this.microLessonCommunication.sendMessageMLToManager(GameAskForScreenChangeBridge, ScreenTypeOx.GameComplete));
          });
        });
      }
    });
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)), z => {
      const exercise = challengeService.exercise;
      this.addMetric();
      this.hintService.usesPerChallenge = 1;
      this.hintService.hintAvailable.next(false);
      this.sceneSvg = 'gnome-game/svg/Fondos/' + exercise.scene.name + '.svg';
      this.surpriseInfo = exercise.scene.surpriseAnimationInfo;
      this.gnomes = exercise.gnomes.map(gnome => {
        return {color: gnome.color, sound: gnome.sound, reference: gnome.reference};
      });
      this.sequence = exercise.sequenceGnomeIds;
      if (this.metricsService.currentMetrics.expandableInfo.exercisesData.length === 1) {
        this.currentScenePositions = exercise.scene.positions;
        this.showCountDown = true;
      } else {
        if (this.challengeService.exerciseConfig.shuffleAfterUserAnswer) {
          this.shuffleGnomes(() => this.playSequence());
        } else {
          this.currentScenePositions = exercise.scene.positions;
          timer(1000).subscribe(hhh => {
            this.playSequence();
          });
        }
      }
    });
  }

  shuffleGnomes(completeFunc: () => void = () => {
  }): void {
    anime({
      targets: '.gnome',
      duration: 750,
      filter: 'brightness(0)',
      easing: 'easeOutInQuad',
      complete: () => {
        this.currentScenePositions =
          this.currentScenePositions.length === 2 ?
            [this.currentScenePositions[1], this.currentScenePositions[0]] :
            shuffle(this.currentScenePositions);
        anime({
          targets: '.gnome',
          duration: 750,
          easing: 'easeOutInQuad',
          filter: 'brightness(1)',
          complete: () => {
            completeFunc();
          }
        });
      }
    });
  }

  ngOnInit(): void {
  }

  public playSequence(): void {
    this.currentStatus = 'ver';
    this.hintService.hintAvailable.next(false);
    const duration = this.challengeService.exercise.soundDuration;
    this.timeToLose.stop();
    this.playingSequence = true;
    // this.currentScene.gnomes.toArray().forEach(gnome => {
    this.interactableGnomes = false;
    // this.sequenceSubscription = timer(duration === 1 ? 500 : 1500, 1000 * duration)
    console.log('Real time executing between sounds: ', 1000 * (duration + this.challengeService.exercise.timeBetweenSounds));
    this.sequenceSubscription = timer(1000,
      1000 * (duration + this.challengeService.exercise.timeBetweenSounds))
      .pipe(take(this.sequence.length + 1)).subscribe(value => {
        if (value < this.sequence.length) {
          this.gnomeComponents.toArray()[this.sequence[value]].playAudio();
        }
      }, () => {
      }, () => {
        if (this.challengeService.exerciseConfig.shuffleAfterSequencePresentation) {
          this.shuffleGnomes(() => this.finishSequence());
        } else {
          this.finishSequence();
        }
      });
  }

  startGame(): void {
    this.showCountDown = false;
    this.playSequence();
  }

  onClickGnome(index: number): void {
    if (this.interactableGnomes) {
      console.log(' Click gnome ', this.gnomes[index]);
      this.gnomeComponents.toArray()[index].playAudio();
      this.answerService.addPartialAnswer(index);
      this.gameActions.actionToAnswer.emit();
    }
  }

  private addMetric(): void {
    const myMetric = {
      schemaType: 'working-memory',
      schemaData: {
        statement: {parts: []},
        additionalInfo: [],
        presentationOrder: 'ordered',
        processingCriteria: {
          type: this.challengeService.exerciseConfig.invertedGnomes
            ? 'inverse-presentation-order' : 'presentation-order'
        },
        stimulus: this.challengeService.exercise.sequenceGnomeIds.map(this.gnomeIdToStimulus.bind(this))
      } as WorkingMemorySchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answer',
      maxHints: this.challengeService.exerciseConfig.maxHintsPerExercise,
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: undefined,
      firstInteractionTime: undefined
    };
    this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
      myMetric.firstInteractionTime = new Date();
    });
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
      z => {
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
    this.metricsService.currentMetrics.exercises++;
  }

  private gnomeIdToStimulus(id: number): WorkingMemoryPart {
    const gnome = this.challengeService.exercise.gnomes[id];
    return {
      type: 'to-remember',
      part: {
        format: 'expanded-showable',
        customProperties: [{value: gnome.color, name: 'color'}],
        value: {
          audio: getGnomeAudio(gnome.sound),
          image: getGnomeImage(gnome.color, 'normal')
        } as ExpandedShowable
      }
    };
  }

  private finishSequence(): void {
    this.playingSequence = false;
    this.gnomeComponents.toArray()[this.sequence[this.sequence.length - 1]].stopAudio();
    this.interactableGnomes = true;
    this.currentStatus = 'jugar';
    console.log('Complete');
    this.hintService.checkHintAvailable();
    this.timeToLose.start(this.challengeService.exercise.maxSecondsBetweenAnswers);
  }

  // private auxIndex = 0;
  // private auxList = ['jardin-alacena-5', 'jardin-biblioteca-6', 'jardin-baño-5', 'jardin-chimenea-4', 'jardin-chimenea-2', 'jardin-escaleras-6', 'jardin-establo-4'];
  // // private auxList = ['mina-dragon-3', 'mina-escalera-3', 'mina-herramientas-2', 'mina-laboratorio-4', 'mina-momia-4'];
  // private animationMode = true;
  // itsTutorial = true;

  // @HostListener('document:keydown', ['$event'])
  // asdsada($event: KeyboardEvent): void {
  //   // if (this.animationMode) {
  //   //   this.animationModeKeyDown($event);
  //   //   return;
  //   // }
  //   console.log($event);
  //   if (this.auxIndex >= this.auxList.length) {
  //     this.auxIndex = 0;
  //   }
  //   if ($event.key === 'n') {
  //     this.timeToLose.stop();
  //     this.sceneSvg = 'gnome-game/svg/Fondos/' + this.auxList[this.auxIndex++] + '.svg';
  //   }
  //   if ($event.key === 'a') {
  //     this.gnomes.push(anyElement(this.challengeService.info.gnomes));
  //     this.currentScenePositions.push({x: '13vh', y: '20.5vh'});
  //   }
  //   if ($event.key === 'c') {
  //     this.gnomes = [];
  //     this.currentScenePositions = [];
  //   }
  //   if ($event.key === 'r') {
  //     this.gnomes = this.gnomes.map(z => anyElement(this.challengeService.info.gnomes));
  //   }
  //   if ($event.key === 's') {
  //     console.log(JSON.stringify(this.currentScenePositions));
  //   }
  //   if ($event.key === 't') {
  //     const auxGnomes: GnomeInfo[] = shuffle(this.challengeService.info.gnomes);
  //     const temp = this.auxList[this.auxIndex++];
  //     this.sceneSvg = 'gnome-game/svg/Fondos/' + temp + '.svg';
  //     this.currentScenePositions = this.challengeService.info.scenes.find(z => z.name === temp).positions;
  //     this.gnomes = this.currentScenePositions.map((a, i) => auxGnomes[i]);
  //   }
  //   if ($event.key === 'p') {
  //     this.shuffleGnomes();
  //   }
  //
  //
  //   if ($event.key === 'ArrowLeft') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].x =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, -0.5);
  //   }
  //   if ($event.key === 'ArrowRight') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].x =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, +0.5);
  //   }
  //   if ($event.key === 'ArrowDown') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].y =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, +0.5);
  //   }
  //   if ($event.key === 'ArrowUp') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].y =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, -0.5);
  //   }
  // }


  //
  // public animationSize = [10, 10];
  // private animationSizeIndex = 0;
  // public animationPathIndex: number = 0;
  // showAnimation = true;
  // public allAnimatinPaths = [
  //   'dragon.json',
  //   'frascos.json',
  //   'lamapraMovimiento.json',
  //   'lampara.json',
  //   'murcielago.json',
  //   'serpiente.json',
  // ];

  // private animationModeKeyDown($event: KeyboardEvent): void {
  //   if ($event.key === 'ArrowLeft') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].x =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, -0.5);
  //   }
  //   if ($event.key === 'ArrowRight') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].x =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, +0.5);
  //   }
  //   if ($event.key === 'ArrowDown') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].y =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, +0.5);
  //   }
  //   if ($event.key === 'ArrowUp') {
  //     this.currentScenePositions[this.currentScenePositions.length - 1].y =
  //       changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, -0.5);
  //   }
  //
  //   if ($event.key === 'w') {
  //     this.animationSizeIndex = 0;
  //   }
  //   if ($event.key === 'h') {
  //     this.animationSizeIndex = 1;
  //   }
  //   if ($event.key === '+') {
  //     this.animationSizeIndex[this.animationSizeIndex] += 0.5;
  //   }
  //   if ($event.key === '-') {
  //     this.animationSizeIndex[this.animationSizeIndex] -= 0.5;
  //   }
  //   if ($event.key === 'n') {
  //     this.showAnimation = false;
  //     timer(500).subscribe(z => this.showAnimation = true);
  //     this.animationPathIndex = this.allAnimatinPaths.length <= this.animationPathIndex
  //       ? 0 : this.animationPathIndex + 1;
  //   }
  //   if ($event.key === 's') {
  //     this.timeToLose.stop();
  //     const inde = this.auxIndex = this.allAnimatinPaths.length <= this.auxIndex
  //       ? 0 : this.auxIndex + 1;
  //     this.sceneSvg = 'gnome-game/svg/Fondos/' + this.auxList[inde] + '.svg';
  //   }
  // }
  // mustClick(i: number) {
  //   return i === 0;
  // }
}

function changeVhValue(value: string, change: number): string {
  return (+replaceAll(value, 'vh', '') + change) + 'vh';
}
