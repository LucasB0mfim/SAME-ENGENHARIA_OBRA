import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DynamicDisplayComponent,
  DynamicField
} from '../../../components/dynamic-display/dynamic-display.component';

import { EmployeesService } from '../../../core/services/employees.service';

// ========================================
// INTERFACES
// ========================================

interface Employee {
  chapa: string;
  nome: string;
  funcao: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDisplayComponent
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  // ========================================
  // PROPRIEDADES
  // ========================================

  apiData: Employee[] = [];

  // Estados de UI
  isEmpty = false;
  isLoading = true;

  // Configuração dos campos
  readonly fields: DynamicField[] = [
    {
      label: 'Nome',
      name: 'nome',
      type: 'title',
      style: 'card'
    },
    {
      label: 'Função',
      name: 'funcao',
      type: 'title',
      style: 'card'
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly employeesService: EmployeesService,
  ) { }

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadEmployees();
  }

  // ========================================
  // MÉTODOS DE CARREGAMENTO DE DADOS
  // ========================================

  private loadEmployees(): void {
    this.employeesService
      .findBasicInfo()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error('Erro ao carregar colaboradores:', error);
          this.isEmpty = true;
        }
      });
  }

  // ========================================
  // HANDLERS DE EVENTOS
  // ========================================

  onCardClick(employee: Employee): void {
    // Navega para a tela de timesheet do colaborador
    this.router.navigate([`/dashboard/time-sheet/${employee.chapa}`]);
  }

  onNavigationBack(): void {
    this.router.navigate(['/dashboard/home']);
  }
}
