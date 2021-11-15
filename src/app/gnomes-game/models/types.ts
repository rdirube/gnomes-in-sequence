import {GnomeComponent} from '../components/gnome/gnome.component';
import {timer} from 'rxjs';

export type GnomeSceneStatus = 'ver' | 'jugar';


export interface GnomeInfo {
  reference: string;
  color: string;
  sound: string;
}


export interface GnomeInfoTutorial {
  reference: string;
  color: string;
  sound: string;
  selectAvaible: boolean;
}


export interface GnomesExercise {
  sequenceGnomeIds: number[];
  scene: GnomeScene;
  gnomes: GnomeInfo[];
  timeBetweenSounds: number;
  secondsToStartAnswer: number;
  maxSecondsBetweenAnswers: number;
  soundDuration: number;
}

export interface GnomesNivelation {
  gnomeMinCount: number;
  gnomeMaxCount: number;

  timeBetweenSounds: number;
  timeBetweenSoundsMultiplierPerExercise: number;

  secondsToStartAnswer: number;

  maxSecondsBetweenAnswers: number;

  startSoundCount: number; // how much sounds are set at the beggining
  stepCount: number; // number of sounds added when a challenge is completed.
  // gnomePositionStrategy: 'random' | 'symetric' | 'asymetric';
  // gnomeSimilarColorDifficulty?: {case: 'different' | 'similar' | 'very-similar', count: number}[];
  // gnomeSimilarSoundDifficulty?: {case: 'different' | 'similar' | 'very-similar', count: number}[];
  validGnomes?: string[];
  forcedGnomes?: string[];
  // sameGnomeInDifferentLocationCount: number;
  soundDuration: number;
  soundDurationMultiplierPerExercise: number;

  possibleScenes: string[];
  invertedGnomes: boolean;
  shuffleAfterSequencePresentation: boolean;
  shuffleAfterUserAnswer: boolean;

  minCorrectExercisesTo6000: number;
  minCorrectExercisesTo10000: number;
  maxHintsPerExercise: number;

}

export interface GnomeScene {
  name: string;
  positions: GnomesPosition[];
  progressAnimation: string;
  surpriseAnimationInfo: SurpriseAnimationInfo;
  symmetricPositionIndexes: { quantity: number, positionIndexes: number[] }[];
  // symmetricPositionIndexes: { [key: string]: number[] };
}

// "name": "mina-dragon-4",
//   "positions": [{"x":"52.5vh","y":"67vh"},{"x":"70.5vh","y":"12vh"},{"x":"6.5vh","y":"14.5vh"}],
//   "progressAnimation": "asd.json",
//   "surpriseAnimationInfo": {
//   "type": "lottie",
//     "lottieUrl": "assets/gnome-game/animations/dragon.json",
//     "sizeAndPosition": {"y": "38vh", "x": "88vh", "width": "30vh","height": "26vh"},
//   "animationSound": "gnome-game/sounds/lightblueshortFinal.mp3"
// }
export interface SurpriseAnimationInfo {
  type: 'lottie' | 'svg-sequence' | 'svg-sequence-by-interval';
  lottieUrl: string;
  lottieFrames: number[][];
  svgList: string[];
  sizeAndPosition: { y: string, x: string, width: string, height: string };
  animationSound: string;
  intervalTime: number;
}

export type GnomeAnswer = number[];


export interface GnomesPosition {
  x: string;
  y: string;
}

export interface StepsTutorial {
  title: string;
}

