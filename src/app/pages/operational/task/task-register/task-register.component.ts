import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState, SelectListItem } from '../../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../../core/services/user.service';
import { EmployeesService } from '../../../../core/services/employees.service';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-register',
  imports: [
    CommonModule,
    DynamicFormComponent
  ],
  templateUrl: './task-register.component.html',
  styleUrl: './task-register.component.scss'
})
export class TaskRegisterComponent implements OnInit {
  submissionState: FormSubmissionState = FormSubmissionState.IDLE;

  userData: any = null;
  employeesList: any[] = [];
  costCenterList: any[] = [];

  errorMessage: string = '';
  successMessage: string = '';

  formSections: DynamicFormSection[] = [
    {
      fields: [
        {
          label: 'Tarefa',
          name: 'descricao',
          type: 'text',
          placeholder: 'Insira o descrição da tarefa',
          required: true
        }
      ],
    },
    {
      fields: [
        {
          label: 'Colaboradores',
          name: 'colaboradores',
          type: 'select-list',
          options: [],
          required: false
        }
      ]
    },
    {
      fields: [
        {
          label: 'Centro de custo',
          name: 'centro_custo',
          type: 'select',
          options: [],
          placeholder: 'Insira o centro de custo',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Início da atividade',
          name: 'data_inicial',
          type: 'date',
          required: true
        }
      ]
    },
    {
      fields: [
        {
          label: 'Fim da atividade',
          name: 'data_final',
          type: 'date',
          required: true
        }
      ]
    }
  ];

  constructor(
    private readonly _taskService: TaskService,
    private readonly _userService: UserService,
    private readonly _employeesService: EmployeesService
  ) { }

  onFormStateChange(newState: FormSubmissionState): void {
    this.submissionState = newState;
  }

  ngOnInit(): void {
    this.getUser();
    this.getActiveEmployees();
    this.getActiveCostCenters();
  }

  getUser(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (error) => {
        console.error('Erro ao buscar usuário:', error);
      }
    });
  }

  getActiveEmployees(): void {
    this._employeesService.findAllNames().subscribe({
      next: (res) => {
        if (res.success && res.result) {
          this.employeesList = res.result;

          const colaboradoresField = this.formSections
            .flatMap(section => section.fields)
            .find(field => field.name === 'colaboradores');

          if (colaboradoresField) {
            colaboradoresField.options = this.employeesList;
          }
        }
      },
      error: (error) => {
        console.error('Erro ao buscar colaboradores:', error);
        this.employeesList = [];
      }
    });
  }

  getActiveCostCenters(): void {
    this._employeesService.findActiveCostCenters().subscribe({
      next: (res) => {
        if (res.success && res.result) {
          this.costCenterList = res.result;

          const costCenterField = this.formSections
            .flatMap(section => section.fields)
            .find(field => field.name === 'centro_custo');

          if (costCenterField) {
            costCenterField.options = this.costCenterList;
          }
        }
      },
      error: (error) => {
        console.error('Erro ao buscar centros de custo:', error);
        this.costCenterList = [];
      }
    });
  }

  onSubmit(formData: FormData): void {
    formData.append('chapa', this.userData.chapa);

    const colaboradoresJson = formData.get('colaboradores') as string;
    if (colaboradoresJson) {
      const colaboradores: SelectListItem[] = JSON.parse(colaboradoresJson);
      console.log('Colaboradores selecionados:', colaboradores);
    }

    this.submissionState = FormSubmissionState.LOADING;
    this._taskService.create(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submissionState = FormSubmissionState.SUCCESS;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao registrar tarefa';
        this.submissionState = FormSubmissionState.ERROR;
      }
    });
  }
}
