import {Injectable} from '@angular/core';
import {equalArrays, ExerciseOx, PreloaderOxService} from 'ox-core';
import {ExpandableInfo, Showable} from 'ox-types';
import {GnomeInfo, GnomesExercise, GnomesNivelation} from '../../gnomes-game/models/types';
import {AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService} from 'micro-lesson-core';

@Injectable({
  providedIn: 'root'
})
export class GnomesChallengeService extends ChallengeService<GnomesExercise, any> {
  // public theme: ThemeInfo;
  public info: any;
  private exerciseIndex: number;
  public resources = new Map<string, string>();
  private exerciseConfig: GnomesNivelation;
  public exercise: GnomesExercise;
  private allGnomes: GnomeInfo[];

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    try {
      this.preloaderService.getResourceData('');
    } catch (e) {

    }
  }

  protected equalsExerciseData(a: GnomesExercise, b: GnomesExercise): boolean {
    return equalArrays(a.gnomes, b.gnomes) && a.soundDuration === b.soundDuration;
  }

  private getSublevelConfig(sublevel: number): any {
    return this.appInfo.getMicroLessonLevelConfiguration(this.levelService.currentLevel.value)
      .sublevelConfigurations[sublevel - 1].properties as any;
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<GnomesExercise> {
    console.log('generateNextChallenge', this.exerciseIndex);
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
    return new ExerciseOx(this.exercise, 1, {maxTimeToBonus: 0, freeTime: 0}, []);
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
    this.exerciseConfig.forcedGnomes.forEach(z => {
      gnomes.push(this.allGnomes.find( g => g.color === z.possibleGnomes));
    });
    this.exercise = {
      soundDuration: this.exerciseConfig.soundDuration,
      gnomes,
      maxSecondsBetweenAnswers: this.exerciseConfig.maxSecondsBetweenAnswers,
      secondsToStartAnswer: this.exerciseConfig.secondsToStartAnswer,
      timeBetweenSounds: this.exerciseConfig.timeBetweenSounds
    };
  }
}
