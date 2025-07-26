import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TableRowTemplateDirective } from '../../directives/table-row-template.directive';
import { TableHeaderTemplateDirective } from '../../directives/table-header-template.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  imports: [CommonModule],
})
export class TableComponent<TItem extends object> {
  @Input() data!: TItem[];
  @ContentChild(TableHeaderTemplateDirective, { read: TemplateRef })
  headers?: TemplateRef<unknown>;
  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rows?: TemplateRef<unknown>;
}
