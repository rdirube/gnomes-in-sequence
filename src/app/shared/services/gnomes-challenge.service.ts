import {Injectable} from '@angular/core';
import {anyElement, equalArrays, ExerciseOx, PreloaderOxService, randomBetween} from 'ox-core';
import {ExpandableInfo, Showable} from 'ox-types';
import {GnomeInfo, GnomeScene, GnomesExercise, GnomesNivelation} from '../../gnomes-game/models/types';
import {AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService} from 'micro-lesson-core';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GnomesChallengeService extends ChallengeService<GnomesExercise, any> {
  // public theme: ThemeInfo;
  public info: any;
  private exerciseIndex: number;
  public resources = new Map<string, string>();
  private exerciseConfig: GnomesNivelation;
  public scene: GnomeScene;
  public exercise: GnomesExercise;
  private allGnomes: GnomeInfo[];

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    gameActionsService.restartGame.subscribe(z => {
      this.cachedExercises = [];
      this.exercise = undefined;
      this.setInitialExercise();
    });
    gameActionsService.showNextChallenge.subscribe(z => {
      console.log('showNextChallenge');
    });
    this.currentExercise.pipe(filter(z => z === undefined)).subscribe(z => {

    });
  }

  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }

  protected equalsExerciseData(a: GnomesExercise, b: GnomesExercise): boolean {
    console.log(equalArrays(a.gnomes, b.gnomes, (one, two) => one.color === two.color)
      && equalArrays(a.sequenceGnomeIds, b.sequenceGnomeIds)
      && a.soundDuration === b.soundDuration);
    return equalArrays(a.gnomes, b.gnomes, (one, two) => one.color === two.color)
      && equalArrays(a.sequenceGnomeIds, b.sequenceGnomeIds)
      && a.soundDuration === b.soundDuration;
  }

  private getSublevelConfig(sublevel: number): any {
    return this.appInfo.getMicroLessonLevelConfiguration(this.levelService.currentLevel.value)
      .sublevelConfigurations[sublevel - 1].properties as any;
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<GnomesExercise> {
    // console.log('generateNextChallenge', this.exercise);
    // console.log('generateNextChallenge', this.exercise);
    console.log('generateNextChallenge');
    console.log('generateNextChallenge');
    console.log('generateNextChallenge');
    console.log('generateNextChallenge', this.exercise);
    this.exercise.sequenceGnomeIds.push(randomBetween(0, this.exercise.gnomes.length - 1));
    // const exercise1: GnomesExercise = {
    //   gnomes: [{color: 'red'}, {color: 'yellow'}],
    //   soundDuration: randomBetween(95, 100) / 100
    // };
    // this.gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    // switch (this.gameCase) {
    //   case 'created-config':
    // if (this.exerciseIndex >= this.allExercises.length) {
    //   this.removeHalfRepeatedExercises();
    //   this.exerciseIndex = 0;
    // }
    // const exercise: GnomesExercise = JSON.parse(JSON.stringify(this.allExercises[this.exerciseIndex]));
    return new ExerciseOx(JSON.parse(JSON.stringify(this.exercise)), 1, {maxTimeToBonus: 0, freeTime: 0}, []);
    // }
  }


  beforeStartGame(): void {
    this.info = JSON.parse(this.preloaderService.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
    this.allGnomes = this.info.gnomes;
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo.microLessonGameInfo.properties;
        this.exerciseIndex = 0;
        this.feedback.endFeedback.subscribe(x => {
          this.exerciseIndex++;
        });
        this.scene = this.info.scenes.find(z => z.name === 'alacena'); // anyElement(this.exerciseConfig.possibleScenes));
        this.setInitialExercise();
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
  }

  getGeneralTitle(): Showable {
    return undefined;
    // return this.appInfo.microLessonInfo.creatorInfo.microLessonGameInfo.generalTitle;
  }

  public getMetricsInitialExpandableInfo(): ExpandableInfo {
    // const generalTitle = this.getGeneralTitle();
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesQuantity: 1, // this.appInfo.microLessonInfo.creatorInfo.exerciseCount
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'no-time',
      }
    };
  }

  private setInitialExercise(): void {
    const gnomes = [];
    const gnomeCount = randomBetween(this.exerciseConfig.gnomeMinCount, this.exerciseConfig.gnomeMaxCount);
    this.exerciseConfig.forcedGnomes.forEach(z => {
      gnomes.push(this.allGnomes.find(g => g.color === z));
    });
    for (let i = 0; i < gnomeCount - this.exerciseConfig.forcedGnomes.length; i++) {
      gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
    }
    const sequenceGnomeIds = [];
    for (let i = 0; i < this.exerciseConfig.startSoundCount; i++) {
      sequenceGnomeIds.push(randomBetween(0, gnomes.length - 1));
    }
    const auxScene = anyElement(this.exerciseConfig.possibleScenes);
    this.exercise = {
      sequenceGnomeIds,
      scene: this.info.scenes.find(z => auxScene.includes(z.name)),
      soundDuration: this.exerciseConfig.soundDuration,
      gnomes,
      maxSecondsBetweenAnswers: this.exerciseConfig.maxSecondsBetweenAnswers,
      secondsToStartAnswer: this.exerciseConfig.secondsToStartAnswer,
      timeBetweenSounds: this.exerciseConfig.timeBetweenSounds
    };
  }
}
