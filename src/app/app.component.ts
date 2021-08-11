import {Component} from '@angular/core';
import {PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ScreenTypeOx} from 'ox-types';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gnomes-in-sequence';
  loadded: boolean;

  constructor(private preloaderService: PreloaderOxService) {
    this.preloaderService.basePath = environment.basePath;
    this.preloaderService.addResourceToLoad(new ResourceOx('Gnomos/Fondos/Establo.svg', ResourceType.Svg, [ScreenTypeOx.Game], true));
    ['Amarillo', 'Celeste', 'Azul', 'Naranja', 'Rojo'].forEach(z => {
      ['_cantando.svg', '_festejo.svg', '_normal.svg'].forEach(x => {
        this.preloaderService.addResourceToLoad(
          new ResourceOx('Gnomos/Gnomos/' + z + '/' + z.toLowerCase() + x, ResourceType.Svg,
            [ScreenTypeOx.Game], true));
      });
    });
    this.preloaderService.loadAll().subscribe(x => {
      this.loadded = true;
    });

  }
}
