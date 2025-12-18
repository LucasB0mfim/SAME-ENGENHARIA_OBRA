import { Component, OnInit } from '@angular/core';
import { DynamicListComponent } from '../../../components/dynamic-list/dynamic-list.component';

import { EmployeesService } from '../../../core/services/employees.service'

import { DynamicField } from '../../../components/dynamic-list/dynamic-list.interface';

@Component({
  selector: 'app-time-sheet',
  imports: [
    DynamicListComponent
  ],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {
  apiData: any[] = [];

  fields: DynamicField[] = [
    { label: 'nome', name: 'nome' },
    { label: 'funcao', name: 'funcao' }
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
