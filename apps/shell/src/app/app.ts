import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBar } from '../ui/nav-bar/nav-bar';
import { initDropdowns, initFlowbite } from 'flowbite';

@Component({
  imports: [RouterModule, NavBar],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
    initDropdowns();
  }
}
