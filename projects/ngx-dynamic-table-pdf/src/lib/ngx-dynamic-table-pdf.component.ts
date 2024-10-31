import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TableIconsComponent } from './components/icons/table-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation/click-stop-propagation.directive';
import { DrawerComponent } from './components/drawer/components/drawer/drawer.component';

import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { rangeFill } from './utils';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { filter } from 'rxjs';

@Component({
  selector: 'ngx-dynamic-table-pdf',
  standalone: true,
  imports: [
    ClickStopPropagationDirective,
    CommonModule,
    DrawerComponent,
    FormsModule,
    MatMenuModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    TableIconsComponent
  ],
  templateUrl: './ngx-dynamic-table-pdf.component.html',
  styleUrls: ['./ngx-dynamic-table-pdf.component.sass']
})
export class NgxDynamicTablePdfComponent implements OnInit, AfterViewInit {
  @Input() data: any = []
  
  // items: any = ['id', 'name', 'date', 'ort', 'checked', 'description']
  columns: any[] = []
  prepared: any

  private pdfMake: any
  // pdfDocGenerator: any
  // public pdf = ''//'./assets/test.pdf'

  // table
  @ViewChild(MatSort) sort!: MatSort
  dataSource: any

  // filter
  showFilter: boolean = false
  // addFilterForm!: FormGroup
  filterForm!: FormGroup

  constructor(private _fb: FormBuilder) {
    this.pdfMake = pdfMake
    this.dataSource = new MatTableDataSource([])

    this.filterForm = this._fb.group({
      filter_col: [''],
      filter_content: [''],
      filter_kind: ['']
    })
  }

  ngOnInit(): void {
    this.pdfMake.vfs = pdfFonts.pdfMake.vfs
    this.columns = Object.keys(this.data[0])
    
    this.dataSource.data = this.createData(this.columns)

    // filter
    let form: any = {} // Obj
    let filterStore: { [key: string]: FormArray } = {}

    let columns = this.getColumns()
    form = Object.assign({ filter_col: columns[0], filter_kind: '', filter_content: '' })
    columns.forEach((item: any) => {
      form = Object.assign(form, { [item]: this._fb.array([])})
    })
    
    this.filterForm = this._fb.group(form)

    columns.forEach((item: any) => {
      filterStore = Object.assign(filterStore, { [item]: <FormArray>this.filterForm.get(item)})
    })

    // this.filterForm.patchValue({ col: this.getColumns()[0] })

    // console.log('new filterStore', filterStore)
    console.log('filterFormValue', this.filterForm.value)

    this.filterForm.valueChanges
    .subscribe({
      next: (data) => {
        console.log('formdata', data)
      },
      complete: () => {
        console.log('complete')
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
  }

  getColumns(): string[] {
    return Object.keys(this.data[0])
  }
  getContentOf(column: string): string[] {
    let content = this.data.map((item: any) => item[column])
    return content
  }
  delete() {
    this.filterForm.patchValue({ filter_content: '' })
  }


  prepareTable(): any {
    // console.log('prepare', this.dataSource.data)
    let col: any[] = this.dataSource.data.filter((item: any) => item.checked)
    let col_name: string[] = col.map((item: any) => item.name)
    // console.log('col', col.map((item: any) => item.name))
    // let col_header: string[] = this.dataSource.data.map((item: any) => {
    //   if (item.checked) return item.name
    // }).filter((item: any) => item !== undefined)
    
    // let col_header = Object.keys(this.data[0])
    let width = rangeFill(col_name.length, '*')
    console.log('header', col_name)
    let table_header = col_name.map((c: string) => {
      return { text: c, style: 'tableHeader' }
    })
    console.log('header', table_header)

    let rows: any[] = []
    this.data.forEach((item: any) => {
      console.log('item', item)
      let row: any[] = []
      col.forEach((c: any) => {
        row.push({ text: item[c.name], style: 'tableRow', color: c.color })
      })
      rows.push(row)
    })
    
    return {
      style: 'default',
      color: '#444',
      table: {
        widths: width,
        headerRows: 1,
        body: [
          table_header,
          ...rows
        ]
      }
    }
  }

  createPdf(): any {
    let prepare: any = {
      table: {},
      watermark: 'Entwurf',
    }

    prepare.table = this.prepareTable()

    return {
      pageSize: 'A4',
      pageOrientation: 'p',
      pageMargins: [70, 80, 50, 40],
      watermark: (prepare.watermark),

      // header
      header(currentPage: any, pageCount: any) {
        return {
          margin: [25 * 2.54, 10 * 2.54, 50, 0],
          columns: [
            {
              table: {

                widths: [360, '*'],
                style: 'headertable',
                body: [
                  [
                    { text: 'Berlin', style: 'title' }, 
                    { rowSpan: 2, alignment: 'right', text: new Date().toLocaleDateString(), style: 'date' }],
                  [
                    { text: 'Document', style: 'doc' },
                    {}
                  ],
                  [
                    { text: '', border: [false, false, false, true] },
                    { text: '', border: [false, false, false, true] }
                  ]
                ]
              },
              layout: {
                defaultBorder: false,
                paddingLeft(i: any, node: any) { return 0; },
                paddingRight(i: any, node: any) { return 0; },
                paddingTop(i: any, node: any) { return 0; },
                paddingBottom(i: any, node: any) { return 0; },
              }
            }
          ]
        }
      },

      // footer
      footer(currentPage: { toString: () => string; }, pageCount: string) {
        return {
          margin: [25 * 2.54, 0, 50, 0],
          columns: [
            {
              table: {

                widths: [360, '*'],
                style: 'headertable',
                body: [
                  [
                    {
                      text: '',
                      style: 'footer'
                    },
                    {
                      text: 'Seite: ' + currentPage.toString() + ' / ' + pageCount,
                      style: 'footer',
                      alignment: 'right'
                    }
                  ],
                  [
                    {
                      text: '',
                      style: 'vgnr'
                    },
                    {}
                  ]
                ]
              },
              layout: {
                defaultBorder: false,
                paddingLeft(i: any, node: any) { return 0; },
                paddingRight(i: any, node: any) { return 0; },
                paddingTop(i: any, node: any) { return 0; },
                paddingBottom(i: any, node: any) { return 0; },
              }
            }
          ]
        }
      },

      // background
      background(currentPage: number, pageSize: number) {
        return [
          {
            absolutePosition: { x: 0, y: 0 },
            canvas: [
              { //faltmarke oben
                type: 'line',
                x1: 8 * 2.54, y1: (297 * 2.54 / 3),
                x2: 13 * 2.54, y2: (297 * 2.54 / 3),
                lineWidth: 0.6
              },
              { //faltmarke unten
                type: 'line',
                x1: 8 * 2.54, y1: (297 * 2.54 / 3 * 2),
                x2: 13 * 2.54, y2: (297 * 2.54 / 3 * 2),
                lineWidth: 0.6
              },
              { //lochmaske
                type: 'line',
                x1: 8 * 2.54, y1: (297 * 2.54 / 2),
                x2: 11 * 2.54, y2: (297 * 2.54 / 2),
                lineWidth: 0.6
              }
            ],
          }
        ]
      },
      content: [
        { text: 'Title', style: 'header' },
        { text: 'Subtitle', style: 'header' },
        prepare.table
      ]
    }
  }

  // table
  createData(columns: any[]): any[] {
    let data: any[] = []
    columns.forEach((item: any, index: number) => {
      data.push({ sort: index, checked: true, name: item, id: item, color: '#000000' })
    })
    return data
  }

  /**
   * Emits a corresponding event to check a row.
   * @param {string} row - The checked row.
   */
  check(row: any) {
    // this.action.emit({ row, action: TableActionEnum.CHECK })
    this.dataSource.data.find((item: any) => item.name == row.name).checked = !row.checked
  }
  /**
   * Emits a corresponding event to check all rows.
   */
  checkAll() {
    switch (true) {
      case this.dataSource.data.every((row: any) => row.checked):
        this.dataSource.data.forEach((row: any) => row.checked = false)
        break
      case this.dataSource.data.every((row: any) => !row.checked):
        this.dataSource.data.forEach((row: any) => row.checked = true)
        break
      default:
        this.dataSource.data.forEach((row: any) => row.checked = true)
        break
    }
  }

  isAllChecked(): boolean {
    return this.dataSource.data.every((row: any) => row.checked)
  }

  changeColor(el: any, value: any) {
    let cleared = this.dataSource.data.filter((item: any) => item.name != el.name)
    this.dataSource.data = [...cleared, { sort: el.sort, checked: el.checked, name: el.name, id: el.id, color: value }]
    this.sortData('sort')
  }
  sortData(property: string = 'sort') {
    this.dataSource.data.sort((a: any, b: any) => {
      return a[property] - b[property]
    })
    this.dataSource._updateChangeSubscription()
  }

  toggleFilter() {
    this.showFilter = !this.showFilter

  }

  open() {
    pdfMake.createPdf(this.createPdf()).open()
  }

  print() {
    pdfMake.createPdf(this.createPdf()).download()
  }

  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: any) => {
      var rnd = Math.random() * 16 | 0, v = c === 'x' ? rnd : (rnd & 0x3 | 0x8)
      return v.toString(16)
    });
  }
}