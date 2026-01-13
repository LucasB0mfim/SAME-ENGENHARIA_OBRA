import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  DynamicDisplayComponent,
  DynamicField
} from '../../../../components/dynamic-display/dynamic-display.component';

import { UserService } from '../../../../core/services/user.service';
import { TaskService } from '../../../../core/services/task.service';

// ========================================
// INTERFACES
// ========================================

interface TaskHistory {
  id: string;
  centro_custo: string;
  descricao: string;
  data_inicial: string;
  data_final: string;
  valor: number;
  autorizacao: string;
}

interface User {
  chapa: string;
  nome: string;
}

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDisplayComponent
  ],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss'
})
export class TaskHistoryComponent implements OnInit {
  // ========================================
  // PROPRIEDADES
  // ========================================

  userData: User | null = null;
  apiData: TaskHistory[] = [];

  // Estados de UI
  isEmpty = false;
  isLoading = true;

  // Configuração dos campos
  readonly fields: DynamicField[] = [
    // Campos visíveis no card
    {
      label: 'Centro de custo',
      name: 'centro_custo',
      type: 'title',
      style: 'card'
    },
    {
      label: 'Descrição da tarefa',
      name: 'descricao',
      type: 'title',
      style: 'card'
    },

    // Campos visíveis no bottom sheet
    {
      label: 'Descrição da tarefa',
      name: 'descricao',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Data de início',
      name: 'data_inicial',
      type: 'date',
      style: 'bottomSheet'
    },
    {
      label: 'Data de término',
      name: 'data_final',
      type: 'date',
      style: 'bottomSheet'
    },
    {
      label: 'Valor a receber',
      name: 'valor',
      type: 'title',
      style: 'bottomSheet'
    },
    {
      label: 'Registro da autorização',
      name: 'autorizacao',
      type: 'title',
      style: 'bottomSheet'
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) { }

  // ========================================
  // LIFECYCLE HOOKS
  // ========================================

  ngOnInit(): void {
    this.loadUser();
  }

  // ========================================
  // MÉTODOS DE CARREGAMENTO DE DADOS
  // ========================================

  private loadUser(): void {
    this.userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
        this.loadTaskHistory();
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.isEmpty = true;
        this.isLoading = false;
      }
    });
  }

  private loadTaskHistory(): void {
    if (!this.userData?.chapa) {
      console.error('Usuário sem chapa definida');
      this.isEmpty = true;
      this.isLoading = false;
      return;
    }

    this.taskService
      .findHistoryTaskByChapa(this.userData.chapa)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.apiData = res.result;
          this.isEmpty = this.apiData.length === 0;
        },
        error: (error) => {
          console.error('Erro ao carregar histórico de tarefas:', error);
          this.isEmpty = true;
        }
      });
  }

  // ========================================
  // HANDLERS DE EVENTOS
  // ========================================

  onNavigationBack(): void {
    this.router.navigate(['/dashboard/home']);
  }
}
