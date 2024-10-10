import { Component, Input, OnInit } from '@angular/core';
import { TableIconsComponent } from './components/icons/table-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';
import { DrawerComponent } from './components/drawer/components/drawer/drawer.component';

import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'ngx-dynamic-table-pdf',
  standalone: true,
  imports: [
    DrawerComponent,
    ClickStopPropagationDirective,
    CommonModule,
    MatMenuModule,
    MatTableModule,
    TableIconsComponent
  ],
  templateUrl: './ngx-dynamic-table-pdf.component.html',
  styleUrls: ['./ngx-dynamic-table-pdf.component.sass']
})
export class NgxDynamicTablePdfComponent implements OnInit {
  @Input() data: any = []
  
  // items: any = ['id', 'name', 'date', 'ort', 'checked', 'description']
  columns: any[] = []

  private pdfMake: any
  pdfDocGenerator: any
  public pdf = ''//'./assets/test.pdf'

  // table
  dataSource: any

  constructor() {
    this.pdfMake = pdfMake
    this.dataSource = new MatTableDataSource([])
  }

  ngOnInit(): void {
    this.pdfMake.vfs = pdfFonts.pdfMake.vfs
    // console.log('data', this.data)
    this.columns = Object.keys(this.data[0])
    this.dataSource.data = this.createData(this.columns)
  }

  show() {
    console.log('show')
  }

  create() {
    console.log('create')
  }

  print() {
    const dd = {
      content: [
        { text: 'Dokumentation', style: 'header' }
      ]
    }
    pdfMake.createPdf(dd).download()
  }

  // table
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