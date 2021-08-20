import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {GnomeInfo} from '../../models/types';
import {GnomesChallengeService} from '../../../shared/services/gnomes-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {filter, take} from 'rxjs/operators';
import {Subscription, timer} from 'rxjs';
import {TimeToLoseService} from '../../../shared/services/time-to-lose.service';
import {GnomeComponent} from '../gnome/gnome.component';

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

  public currentAnswerSequence = [];

  public readonly positionsPerScene = [
    {
      scene: 'alacena',
      positions: [
        {x: '13vh', y: '20.5vh'},
        {x: '102vh', y: '20.5vh'},
        {x: '13vh', y: '62.5vh'},
        {x: '102vh', y: '62.5vh'},
      ]
    }
  ];
  public currentPositionsPerScene = [];
  showCountDown: boolean;
  private interactableGnomes: boolean;

  constructor(private challengeService: GnomesChallengeService,
              public timeToLose: TimeToLoseService) {
    super();
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)), z => {
      const exercise = challengeService.exercise;
      this.currentPositionsPerScene = this.positionsPerScene.find(y => y.scene === this.challengeService.scene.name).positions;
      this.gnomes = exercise.gnomes.map(gnome => {
        return {color: gnome.color, sound: gnome.sound};
      });
      this.sequence = exercise.sequenceGnomeIds;
      if (this.showCountDown === undefined) {
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
    this.sequenceSubscription = timer(duration === 1 ? 500 : 1500, 1000 * duration)
      .pipe(take(this.sequence.length + 1)).subscribe(value => {
        if (value < this.sequence.length) {
          this.gnomeComponents.toArray()[this.sequence[value]].playAudio();
        }
      }, () => {

      }, () => {
        this.playingSequence = false;
        this.gnomeComponents.toArray()[this.sequence[this.sequence.length - 1]].stopAudio();
        this.interactableGnomes = true;
        this.timeToLose.start();
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
    }
  }
}
