import { Component, Input, OnInit } from '@angular/core';
import { TableIconsComponent } from './components/icons/table-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';
import { DrawerComponent } from './components/drawer/components/drawer/drawer.component';

import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from "pdfmake/build/vfs_fonts"

@Component({
  selector: 'ngx-dynamic-table-pdf',
  standalone: true,
  imports: [
    DrawerComponent,
    ClickStopPropagationDirective,
    CommonModule,
    MatMenuModule,
    TableIconsComponent
  ],
  templateUrl: './ngx-dynamic-table-pdf.component.html',
  styleUrls: ['./ngx-dynamic-table-pdf.component.sass']
})
export class NgxDynamicTablePdfComponent implements OnInit {
  @Input() data: any = []
  
  items: any = ['id', 'name', 'date', 'ort', 'checked', 'description']

  private pdfMake: any
  pdfDocGenerator: any
  public pdf = ''//'./assets/test.pdf'

  constructor() {
    this.pdfMake = pdfMake
  }

  ngOnInit(): void {
    this.pdfMake.vfs = pdfFonts.pdfMake.vfs
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
}