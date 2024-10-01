import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu'
import { NgxDynamicTablePdfComponent } from '../../../ngx-dynamic-table-pdf/src/public-api';
import { StickyDirective } from '../../../ngx-dynamic-table-pdf/src/lib/directives/sticky/sticky.directive';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    RouterOutlet,
    NgxDynamicTablePdfComponent,
    StickyDirective,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit { 
  daten: any = [
    { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false, description: 'Test1' },
    { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: false, description: 'Test2' },
    { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: false, description: 'Test3' },
    { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false, description: 'Halllo1' },
    { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false, description: 'Hallo2' },
    { id: '6', name: 'Rene', date: '04.02.2023 00:01:59', ort: 'Köln', checked: false, description: 'Hallo2' }
  ]

  dataSource: any
  // @ViewChild(MatSort) sort!: MatSort
  
  constructor() {
    this.dataSource = new MatTableDataSource([])
  }
  ngOnInit(): void {
    // this.dataSource.sort = this.sort
    this.dataSource.data = this.createData(Object.keys(this.daten[0]))
  }

  createData(columns: any[]): any[] {
    let data: any[] = []
    columns.forEach((item: any) => {
      data.push({ checked: true, name: item, color: '#000000' })
    })
    return data
  }

  /**
   * Emits a corresponding event to check a row.
   * @param {string} row - The checked row.
   */
  check(row: any) {
    // this.action.emit({ row, action: TableActionEnum.CHECK })
  }
  /**
   * Emits a corresponding event to check all rows.
   */
  checkAll() {
    this.dataSource.data.forEach((row: any) => row.checked = !row.checked)
  }

  isAllChecked(): boolean {
    return this.dataSource.data.every((row: any) => row.checked)
  }
}
