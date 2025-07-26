import { Component } from '@angular/core';
import { RepositoriesTable } from '../../domains/repositories/ui/repositories-table/repositories-table';

@Component({
  selector: 'app-home',
  imports: [RepositoriesTable],
  templateUrl: './home.html',
})
export class Home {}
