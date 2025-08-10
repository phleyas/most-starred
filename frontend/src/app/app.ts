import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './shell/nav-bar/nav-bar';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
})
export class App implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
