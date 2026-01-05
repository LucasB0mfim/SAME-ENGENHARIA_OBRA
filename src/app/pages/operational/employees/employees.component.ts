import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDisplayComponent, DynamicField, CardClickConfig } from '../../../components/dynamic-display/dynamic-display.component';

import { EmployeesService } from '../../../core/services/employees.service';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    DynamicDisplayComponent
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  apiData: any[] = [];

  fields: DynamicField[] = [
    { label: 'Nome', name: 'nome', type: 'title' },
    { label: 'Função', name: 'funcao', type: 'title' },
  ]

  clickConfig: CardClickConfig = {
    type: 'navigation',
    route: '/time-sheet'
  }

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
