import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu'
import { NgxDynamicTablePdfComponent, TableIconsComponent } from '../../../ngx-dynamic-table-pdf/src/public-api';
import { StickyDirective } from '../../../ngx-dynamic-table-pdf/src/lib/directives/sticky/sticky.directive';
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatPaginatorModule } from '@angular/material/paginator'
import { NgxDynamicTableComponent, Tableoptions } from '@christophhu/ngx-dynamic-table';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    RouterOutlet,
    NgxDynamicTableComponent,
    NgxDynamicTablePdfComponent,
    StickyDirective,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TableIconsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit { 
  isVisible: boolean = false

  data: any = [
    { id: '1', name: 'Tim', date: '01.01.2024 00:00:59', ort: 'Berlin', checked: false, description: 'Test1' },
    { id: '2', name: 'Tom', date: '01.01.2023 00:00:59', ort: 'Hamburg', checked: false, description: 'Test2' },
    { id: '3', name: 'Thomas', date: '01.02.2023 00:00:59', ort: 'Dresden', checked: false, description: 'Test3' },
    { id: '4', name: 'Martin', date: '03.02.2023 00:00:59', ort: 'München', checked: false, description: 'Halllo1' },
    { id: '5', name: 'Markus', date: '04.02.2023 00:00:59', ort: 'Köln', checked: false, description: 'Hallo2' },
    { id: '6', name: 'Rene', date: '04.02.2023 00:01:59', ort: 'Köln', checked: false, description: 'Hallo2' }
  ]

  tableoptions: Tableoptions = {
    columns: [
      { id: '1', name: 'id', header: 'ID', cell: 'id', hidden: true, sortable: true },
      { id: '2', name: 'name', header: 'Name', cell: 'name', hidden: false, sortable: true },
      { id: '3', name: 'date', header: 'Datum/Zeit', cell: 'date', pipe: { name: DatePipe, args: 'dd.MM.YYYY HH:mm:ss'}, hidden: false, sortable: true },
      { id: '4', name: 'ort', header: 'Ort', cell: 'ort', hidden: false, sortable: true },
    ],
    columnFilter: ['name', 'date', 'ort'],
    columnNames: ['name', 'date', 'ort'],
    isExpandable: false,
    checkbox: false,
    count: false,
    paginator: false,
    sortRowManual: false,
    unread: false,
    sortColumn: 'date',
    sortStart: 'asc'
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true
    },2000)
  }

  getData(): Observable<any> {
    return of(this.data)
  }
}