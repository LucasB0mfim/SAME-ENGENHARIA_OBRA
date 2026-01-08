import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DynamicDisplayComponent, DynamicField } from '../../../components/dynamic-display/dynamic-display.component';

import { TimeSheetService } from '../../../core/services/time-sheet.service';

@Component({
  selector: 'app-time-sheet',
  imports: [
    CommonModule,
    MatIconModule,
    CommonModule,
    DynamicDisplayComponent,
  ],
  templateUrl: './time-sheet.component.html',
  styleUrl: './time-sheet.component.scss'
})
export class TimeSheetComponent implements OnInit {

  chapa: string = '';
  apiData: any = null;
  userName: string = 'Colaborador';

  isEmpty: boolean = false;
  isLoading: boolean = true;

  fields: DynamicField[] = [
    { label: 'Período', name: 'periodo', type: 'date' },
    { label: 'Jornada de Trabalho', name: 'jornada_realizada', type: 'text' }
  ];

  constructor(
    private router: ActivatedRoute,
    private timeSheetService: TimeSheetService
  ) { }

  ngOnInit(): void {
    this.getChapa();
    this.getTimeSheet();
  }

  getChapa(): void {
    this.router.params.subscribe(params => {
      this.chapa = params['chapa'];
    });
  }

  getTimeSheet(): void {
    this.timeSheetService.findEmployeeByChapa(this.chapa)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.userName = res.colaborador;
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          this.isEmpty = this.apiData.length === 0;
          console.error('Erro ao buscar dados do colaborador:', error);
        }
      });
  }
}
