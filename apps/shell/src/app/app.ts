import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBar } from '../ui/nav-bar/nav-bar';
import { initDropdowns, initFlowbite } from 'flowbite';
import { Meta } from '@angular/platform-browser';

@Component({
  imports: [RouterModule, NavBar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  meta = inject(Meta);
  ngOnInit(): void {
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Modular Angular + Nx monorepo frontend integrating air quality sensors, charts and flowbite design system.',
      },
      { name: 'author', content: 'Ignacio Köstner' },
      {
        name: 'keywords',
        content: 'Angular, Nx, Modular, Monorepo, Frontend, C#, CSharp, Fast endpoints, Air Quality, Charts',
      },
      { property: 'og:title', content: 'Angular Nx Monorepo Frontend' },
      { property: 'og:description', content: 'Modular, fast, air quality & charts dashboard.' },
      { name: 'twitter:title', content: 'Angular Nx Monorepo Frontend' },
      { name: 'twitter:description', content: 'Modular, fast, air quality dashboard.' },
    ]);
  }
  ngAfterViewInit(): void {
    initFlowbite();
    initDropdowns();
  }
}
