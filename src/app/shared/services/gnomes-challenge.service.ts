import {Injectable} from '@angular/core';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {ExpandableInfo, Showable, randomBetween, anyElement, equalArrays, lastNElementsOfArray} from 'ox-types';
import {GnomeInfo, GnomeScene, GnomesExercise, GnomesNivelation} from '../../gnomes-game/models/types';
import {AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService} from 'micro-lesson-core';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GnomesChallengeService extends ChallengeService<GnomesExercise, any> {
  // public theme: ThemeInfo;
  public info: {
    gnomes: GnomeInfo[],
    scenes: GnomeScene[]
  };
  private exerciseIndex: number;
  public resources = new Map<string, string>();
  public exerciseConfig: GnomesNivelation;
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
      // console.log('showNextChallenge');
    });
    this.currentExercise.pipe(filter(z => z === undefined)).subscribe(z => {

    });
  }

  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }

  protected equalsExerciseData(a: GnomesExercise, b: GnomesExercise): boolean {
    // console.log(equalArrays(a.gnomes, b.gnomes, (one, two) => one.color === two.color)
    //   && equalArrays(a.sequenceGnomeIds, b.sequenceGnomeIds)
    //   && a.soundDuration === b.soundDuration);
    return equalArrays(a.gnomes, b.gnomes, (one, two) => one.color === two.color)
      && equalArrays(a.sequenceGnomeIds, b.sequenceGnomeIds)
      && a.soundDuration === b.soundDuration;
  }

  private getSublevelConfig(sublevel: number): any {
    return this.appInfo.getMicroLessonLevelConfiguration(this.levelService.currentLevel.value)
      .sublevelConfigurations[sublevel - 1].properties as any;
  }

  getValidGnomeIds(maxConsecutive: number, sequenceIds: number[], exerciseGnomes: GnomeInfo[]): number[] {
    const last3Gnomes = lastNElementsOfArray(sequenceIds, 3);
    const gnomeIds = exerciseGnomes.map((z, i) => i);
    const last3GnomesAreEqual = last3Gnomes.every(z => z === last3Gnomes[0]) ? last3Gnomes[0] : null;
    return gnomeIds.filter(z => z !== last3GnomesAreEqual);
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<GnomesExercise> {
    // console.log('generateNextChallenge', this.exercise);
    for (let i = 0; i < this.exerciseConfig.stepCount; i++) {
      this.exercise.sequenceGnomeIds.push(
        anyElement(this.getValidGnomeIds(3, this.exercise.sequenceGnomeIds, this.exercise.gnomes)));
    }
    const minSoundDuration = 0.35;
    const minTimeBetween = 0.1;
    // console.log('initial values: ', this.exercise.soundDuration, this.exercise.timeBetweenSounds);
    this.exercise.soundDuration = Math.max(minSoundDuration,
      this.exerciseConfig.soundDurationMultiplierPerExercise * this.exercise.soundDuration);
    this.exercise.timeBetweenSounds = Math.max(minTimeBetween,
      this.exerciseConfig.timeBetweenSoundsMultiplierPerExercise * this.exercise.timeBetweenSounds);
    // console.log('after miltiplues  values: ', this.exercise.soundDuration, this.exercise.timeBetweenSounds);
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
    console.log('Before start game.');
    this.info = JSON.parse(this.preloaderService.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
    this.allGnomes = this.info.gnomes;
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;

        this.exerciseConfig = JSON.parse('{"type":"mini-lesson","ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","isPublic":false,"tagIds":{},"supportedLanguages":{"en":false,"es":true},"libraryItemType":"resource","inheritedPedagogicalObjectives":[],"backupReferences":"","properties":{"format":"custom-ml-nivelation","url":"https://ml-screen-manager.firebaseapp.com","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"Custom nivelation","customConfig":{"extraInfo":{"exerciseCase":"created-config","gameUrl":"https://gnomes-in-sequence-2.web.app","theme":"executive-functions"},"creatorInfo":{"metricsType":"results","type":"challenges","exerciseCount":"infinite","microLessonGameInfo":{"exerciseCount":2,"properties":{"gnomeMaxCount":4,"forcedGnomes":["jardin-amarillo","jardin-azul"],"secondsToStartAnswer":2,"stepCount":1,"timeBetweenSounds":0.25,"minCorrectExercisesTo10000":9,"timeBetweenSoundsMultiplierPerExercise":0.95,"soundDurationMultiplierPerExercise":0.95,"possibleScenes":["jardin-alacena-5.svg","jardin-biblioteca-6.svg"],"minCorrectExercisesTo6000":5,"maxHintsPerExercise":1,"soundDuration":1,"maxSecondsBetweenAnswers":8,"validGnomes":["jardin-amarillo","jardin-azul","jardin-celeste","jardin-naranja","jardin-rojo","jardin-verde","jardin-violeta"],"shuffleAfterUserAnswer":true,"invertedGnomes":true,"shuffleAfterSequencePresentation":true,"startSoundCount":1,"gnomeMinCount":4}},"screenTheme":"executive-functions","creatorType":"gnomes-in-sequence"}}},"uid":"JqKccU90ixhZXsayO6Re","customTextTranslations":{"es":{"name":{"text":"GnomesTEST"},"description":{"text":"d"},"previewData":{"path":"library/items/JqKccU90ixhZXsayO6Re/preview-image-es"}}}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
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
    // this.totalTimeSubscription = timer(0, 1000).subscribe(() => this.metrics.totalSecondsInResource++);
    // TODO see what to do with this
    //  this.netTimeSubscription = timer(0, 1000).subscribe(() => this.metrics.netTime++);
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'between-interactions',
      },
    };
  }

  private setInitialExercise(): void {
    // console.log(' Setting inital exercise');
    const gnomes = [];
    const gnomeCount = randomBetween(this.exerciseConfig.gnomeMinCount, this.exerciseConfig.gnomeMaxCount);
    this.exerciseConfig.forcedGnomes.forEach(z => {
      gnomes.push(this.allGnomes.find(g => g.reference === z));
    });
    const validGnomesToAdd = this.allGnomes.filter(z => this.exerciseConfig.validGnomes.includes(z.reference));
    for (let i = 0; i < gnomeCount - this.exerciseConfig.forcedGnomes.length; i++) {
      gnomes.push(anyElement(validGnomesToAdd.filter(z => !gnomes.includes(z))));
    }
    const sequenceGnomeIds = [];
    const auxScene = anyElement(this.exerciseConfig.possibleScenes);
    // const auxScene = 'jardin-alacena-5';
    // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
    // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
    // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
    for (let i = 0; i < this.exerciseConfig.startSoundCount - 1; i++) {
      sequenceGnomeIds.push(anyElement(this.getValidGnomeIds(3, sequenceGnomeIds, gnomes)));
    }
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

// export function threeLastGnomesCheckOut(gnomesArray:) {
//   return {
//     const const gnomeIds = this.exercise.gnomes.map((z, i) => i);
//   const filteredGnomesIds = gnomeIds.filter(z => z !== last3Gnomes[0]);
//   }
// }

