  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { DynamicDisplayComponent, DynamicField } from '../../../components/dynamic-display/dynamic-display.component';

  import { EmployeesService } from '../../../core/services/employees.service';

  @Component({
    selector: 'app-time-sheet',
    imports: [
      CommonModule,
      DynamicDisplayComponent
    ],
    templateUrl: './time-sheet.component.html',
    styleUrl: './time-sheet.component.scss'
  })
  export class TimeSheetComponent implements OnInit {
    apiData: any[] = [];

    fields: DynamicField[] = [
      { label: 'Nome', name: 'nome', type: 'title' },
      { label: 'Função', name: 'funcao', type: 'title' },
    ]

    constructor(
      private readonly _employeesService: EmployeesService,
    ) { }

    ngOnInit(): void {
      this._employeesService.findBasicInfo().subscribe({
        next: (res) => {
          this.apiData = res.result;
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
