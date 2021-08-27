import {Component, ElementRef, HostListener, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GnomeInfo, GnomesExercise} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {filter, take} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
import {TimeToLoseService} from '../../../shared/services/time-to-lose.service';
import {GnomeComponent} from '../gnome/gnome.component';
import {
  FeedbackOxService,
  GameActionsService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService
} from 'micro-lesson-core';
import {GnomeAnswerService} from '../../../shared/services/gnome-answer.service';
import {ExpandedShowable, GameAskForScreenChangeBridge, ScreenTypeOx, WorkingMemoryPart, WorkingMemorySchemaData} from 'ox-types';
import {getGnomeAudio, getGnomeImage} from '../../../shared/functions/gnomes-functions';
import {anyElement, replaceAll} from 'ox-core';

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

  // public readonly positionsPerScene = [
  //   {
  //     scene: 'alacena-5',
  //     positions: [
  //       {x: '13vh', y: '20.5vh'},
  //       {x: '102vh', y: '20.5vh'},
  //       {x: '13vh', y: '62.5vh'},
  //       {x: '102vh', y: '62.5vh'},
  //     ]
  //   }
  // ];
  public currentScenePositions = [];
  showCountDown: boolean;
  private interactableGnomes: boolean;
  public sceneSvg: string;

  constructor(private challengeService: GnomesChallengeService,
              private metricsService: MicroLessonMetricsService<GnomesExercise>,
              private timeToLose: TimeToLoseService,
              private gameActions: GameActionsService<GnomesExercise>,
              private feedback: FeedbackOxService,
              private microLessonCommunication: MicroLessonCommunicationService<any>,
              private answerService: GnomeAnswerService) {
    super();
    // this.addSubscription(this.gameActions.microLessonCompleted, z => {
    //   this.showCountDown = undefined;
    // });
    // this.addSubscription(this.gameActions.goToResults, z => {
    //   this.showCountDown = undefined;
    // });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      this.interactableGnomes = false;
      this.timeToLose.stop();
      if (z.correctness === 'correct') {
        timer(1000).subscribe(sadas => {
          this.feedback.endFeedback.emit();
          this.gameActions.showNextChallenge.emit();
        });
        console.log('this.feedback.endFeedback correctcorrectcorrect');
      } else {
        timer(1000).subscribe(sadas => {
          this.feedback.endFeedback.emit();
          timer(1000).subscribe(aa => {
            this.gameActions.microLessonCompleted.emit();
            this.microLessonCommunication.sendMessageMLToManager(GameAskForScreenChangeBridge, ScreenTypeOx.GameComplete);
          });
        });
      }
    });
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)), z => {
      const exercise = challengeService.exercise;
      this.addMetric();
      this.sceneSvg = 'gnome-game/svg/Fondos/' + exercise.scene.name + '.svg';
      this.currentScenePositions = exercise.scene.positions;
      this.gnomes = exercise.gnomes.map(gnome => {
        return {color: gnome.color, sound: gnome.sound};
      });
      this.sequence = exercise.sequenceGnomeIds;
      if (this.metricsService.currentMetrics.expandableInfo.exercisesData.length === 1) {
        this.showCountDown = true;
      } else {
        timer(1000).subscribe(hhh => {
          this.playSequence();
        });
      }
    });
  }

  ngOnInit(): void {
  }


  public playSequence(): void {
    const duration = this.challengeService.exercise.soundDuration;
    this.timeToLose.stop();
    this.playingSequence = true;
    // this.currentScene.gnomes.toArray().forEach(gnome => {
    this.interactableGnomes = false;
    // this.sequenceSubscription = timer(duration === 1 ? 500 : 1500, 1000 * duration)
    this.sequenceSubscription = timer(1000, 1000 * (duration + this.challengeService.exercise.timeBetweenSounds))
      .pipe(take(this.sequence.length + 1)).subscribe(value => {
        if (value < this.sequence.length) {
          this.gnomeComponents.toArray()[this.sequence[value]].playAudio();
        }
      }, () => {

      }, () => {
        this.playingSequence = false;
        this.gnomeComponents.toArray()[this.sequence[this.sequence.length - 1]].stopAudio();
        this.interactableGnomes = true;
        this.timeToLose.start(this.challengeService.exercise.maxSecondsBetweenAnswers);
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
    }
  }

  private addMetric(): void {
    this.metricsService.addMetric({
      schemaType: 'working-memory',
      schemaData: {
        statement: {parts: []},
        additionalInfo: [],
        presentationOrder: 'ordered',
        processingCriteria: {orderOrientation: 'ascendant', type: 'presentation-order'},
        stimulus: this.challengeService.exercise.sequenceGnomeIds.map(this.gnomeIdToStimulus.bind(this))
      } as WorkingMemorySchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answer',
      maxHints: 'none',
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: undefined,
      firstInteractionTime: undefined
    });
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

  private auxIndex = 0;
  private auxList = ['alacena-5', 'biblioteca-6', 'baño-5', 'chimenea-4',
    'chimenea-2',
    'escaleras-6', 'establo-4'];

  @HostListener('document:keydown', ['$event'])
  asdsada($event): void {
    console.log($event);
    if (this.auxIndex >= this.auxList.length) {
      this.auxIndex = 0;
    }
    if ($event.key === 'n') {
      this.timeToLose.stop();
      this.sceneSvg = 'gnome-game/svg/Fondos/' + this.auxList[this.auxIndex++] + '.svg';
    }
    if ($event.key === 'a') {
      this.gnomes.push(anyElement(this.challengeService.info.gnomes));
      this.currentScenePositions.push({x: '13vh', y: '20.5vh'});
    }
    if ($event.key === 'c') {
      this.gnomes = [];
      this.currentScenePositions = [];
    }
    if ($event.key === 'r') {
      this.gnomes = this.gnomes.map(z => anyElement(this.challengeService.info.gnomes));
    }
    if ($event.key === 's') {
      console.log(JSON.stringify(this.currentScenePositions));
    }
    if ($event.key === 't') {
      const temp = this.auxList[this.auxIndex++];
      this.sceneSvg = 'gnome-game/svg/Fondos/' + temp + '.svg';
      this.currentScenePositions = this.challengeService.info.scenes.find(z => z.name === temp).positions;
      this.gnomes = this.currentScenePositions.map( (a, i) => this.challengeService.info.gnomes[i]);
    }


    if ($event.key === 'ArrowLeft') {
      this.currentScenePositions[this.currentScenePositions.length - 1].x =
        changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, -0.5);
    }
    if ($event.key === 'ArrowRight') {
      this.currentScenePositions[this.currentScenePositions.length - 1].x =
        changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].x, +0.5);
    }
    if ($event.key === 'ArrowDown') {
      this.currentScenePositions[this.currentScenePositions.length - 1].y =
        changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, +0.5);
    }
    if ($event.key === 'ArrowUp') {
      this.currentScenePositions[this.currentScenePositions.length - 1].y =
        changeVhValue(this.currentScenePositions[this.currentScenePositions.length - 1].y, -0.5);
    }
  }

}

function changeVhValue(value: string, change: number): string {
  return (+replaceAll(value, 'vh', '') + change) + 'vh';
}
