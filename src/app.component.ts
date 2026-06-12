import { Component, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  theme = inject(ThemeService);

  constructor() {
    effect(() => {
    });
  }
}
