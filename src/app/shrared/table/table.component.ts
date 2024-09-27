import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumButton, Column } from './column';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T> implements OnChanges {

  @Input() dataColumns: Array<Column> = [];
  @Input() dataRows: any[] = [];
  @Input() buttonsTable: Array<ColumButton> = [];

  tableColumns: any[] = [];
  tableRows: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.tableColumns = this.dataColumns;
    this.tableRows = this.dataRows || [];
  }
}
