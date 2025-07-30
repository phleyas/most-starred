import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './shell/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
})
export class App {}
