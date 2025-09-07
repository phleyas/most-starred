import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private router: Router = inject(Router);
  isSmallScreen = window.innerWidth < 640;

  get isAirQualityRouteActive(): boolean {
    return this.router.url.startsWith('/air-quality');
  }
  @HostListener('window:resize')
  onResize() {
    this.isSmallScreen = window.innerWidth < 640;
  }
}
