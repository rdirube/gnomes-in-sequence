import {Component, Input, OnInit} from '@angular/core';
import {GnomeScene, GnomeSceneStatus} from '../../models/types';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  // @Input() sceneInfo: GnomeScene;
  @Input() sceneSvg: string;
  @Input() status: GnomeSceneStatus;

  constructor() { }

  ngOnInit(): void {
  }

}
