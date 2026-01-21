import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent, DynamicFormSection, FormSubmissionState } from '../../../../components/dynamic-form/dynamic-form.component';

import { UserService } from '../../../../core/services/user.service';
import { EmployeesService } from '../../../../core/services/employees.service';
import { DisciplinaryMeasureService } from '../../../../core/services/disciplinary-measure.service';

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
          label: 'Centro de custo',
          name: 'centro_custo',
          type: 'text',
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
    private readonly _disciplinaryMeasureService: DisciplinaryMeasureService,
    private readonly _userService: UserService,
    private readonly _employeesService: EmployeesService
  ) { }

  onFormStateChange(newState: FormSubmissionState): void {
    this.submissionState = newState;
  }

  ngOnInit(): void {
    this.getUser();
    this.getActiveEmployees();
  }

  getUser(): void {
    this._userService.getInfo().subscribe({
      next: (res) => {
        this.userData = res.result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getActiveEmployees(): void {
    this._employeesService.findActiveNames().subscribe({
      next: (res) => {
        this.employeesList = res.result;

        const colaboradorField = this.formSections[0].fields.find(f => f.name === 'colaborador');
        if (colaboradorField) {
          colaboradorField.options = this.employeesList;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit(formData: FormData): void {
    formData.append('criado_por', this.userData.nome);

    this.submissionState = FormSubmissionState.LOADING;
    this._disciplinaryMeasureService.create(formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.submissionState = FormSubmissionState.SUCCESS;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erro ao registrar medida disciplinar';
        this.submissionState = FormSubmissionState.ERROR;
      }
    });
  }
}
