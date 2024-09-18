import { Component } from '@angular/core';
import { ToggleService } from '../header/toggle.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
  ],
  standalone: true,
})
export class SidebarComponent {
  panelOpenState = false;

  isToggled = false;

  constructor(private toggleService: ToggleService) {
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  toggle() {
    this.toggleService.toggle();
  }
}
