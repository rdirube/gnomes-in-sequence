import {Component, Input, OnInit} from '@angular/core';
import {GnomeScene} from '../../models/types';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  // @Input() sceneInfo: GnomeScene;
  @Input() sceneSvg: string;

  constructor() { }

  ngOnInit(): void {
  }

}
